// src/contracts/strategies/DeltaHedger.sol
pragma solidity ^0.8.27;

import {IEVC} from "../lib/ethereum-vault-connector/src/interfaces/IEthereumVaultConnector.sol";
import {IEulerSwap} from "./interfaces/IEulerSwap.sol";
import {IPerpetualExchange} from "./interfaces/IPerpetualExchange.sol";
import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {IEVault} from "../lib/euler-vault-kit/src/EVault/IEVault.sol";

contract DeltaHedger is Ownable {
    // ----- Core Architecture -----
    IEVC public immutable evc;
    address public immutable account;
    IEulerSwap public immutable eulerSwap;
    IPerpetualExchange public immutable perpExchange;
    IERC20 public immutable baseAsset;  // ETH
    IERC20 public immutable quoteAsset; // USDC
    
    // ----- Configuration Parameters -----
    uint256 public rebalanceThresholdBps = 500; // 5% in basis points
    uint256 public lastRebalancePrice;
    uint256 public minHealthFactor = 1.2e18; // 120% (1e18 precision)
    uint256 public rebalanceCooldown = 30 minutes;
    uint256 public lastRebalanceTime;
    
    // ----- Events -----
    event Rebalanced(int256 delta, uint256 price, uint256 timestamp);
    event EmergencyClosed(uint256 healthFactor);
    event ThresholdUpdated(uint256 newThreshold);
    event HealthFactorUpdated(uint256 newHealthFactor);
    
    // ----- Errors -----
    error OnlyEVC();
    error OnlyAccountOwner();
    error PriceStale();
    error NoRebalanceNeeded();
    error InvalidInput();
    error HealthFactorTooLow(uint256 currentHF);
    error CooldownActive();
    error NotInitialized();

    // ----- Modifiers -----
    modifier onlyEVC() {
        if (msg.sender != address(evc)) revert OnlyEVC();
        _;
    }

    modifier onlyAccountOwner() {
        if (msg.sender != account) revert OnlyAccountOwner();
        _;
    }

    constructor(
        IEVC evc_,
        IEulerSwap eulerSwap_,
        IPerpetualExchange perpExchange_
    ) Ownable(msg.sender) {
        evc = evc_;
        account = msg.sender;
        eulerSwap = eulerSwap_;
        perpExchange = perpExchange_;
        
        // Set assets from EulerSwap pool
        (address asset0, address asset1) = eulerSwap_.getAssets();
        baseAsset = IERC20(asset0);
        quoteAsset = IERC20(asset1);
    }

    // ----- Initialization -----
    function initializeStrategy(uint256 initialPrice) external onlyAccountOwner {
        if (initialPrice == 0) revert InvalidInput();
        lastRebalancePrice = initialPrice;
        lastRebalanceTime = block.timestamp;
    }

    // ----- Core Rebalancing -----
    function checkRebalance(uint256 currentPrice) external {
        // Prevent reentrancy during EVC batches
        // if (address(evc).code.length > 0 && evc.isBatchInProgress()) 
        //     revert OnlyEVC();
        
        // Validate initialization
        if (lastRebalancePrice == 0) revert NotInitialized();
        
        // Check cooldown
        if (block.timestamp < lastRebalanceTime + rebalanceCooldown) 
            revert CooldownActive();
        
        // Calculate price movement
        uint256 priceChangeBps;
        if (currentPrice > lastRebalancePrice) {
            priceChangeBps = ((currentPrice - lastRebalancePrice) * 10_000) / lastRebalancePrice;
        } else {
            priceChangeBps = ((lastRebalancePrice - currentPrice) * 10_000) / lastRebalancePrice;
        }
        
        // Check threshold
        if (priceChangeBps < rebalanceThresholdBps) 
            revert NoRebalanceNeeded();
        
        // Execute via EVC
        bytes[] memory operations = new bytes[](1);
        operations[0] = abi.encodeCall(this.executeRebalance, (currentPrice));
        IEVC.BatchItem[] memory items = new IEVC.BatchItem[](1);
        items[0] = IEVC.BatchItem({
            targetContract: address(this),
            onBehalfOfAccount: account,
            value: 0,
            data: operations[0]
        });
        evc.batch(items);
    }

    function executeRebalance(uint256 currentPrice) external onlyEVC {
        // 1. Health check
        address vault = eulerSwap.getParams().vault0;
        (uint256 collateralValue, uint256 liabilityValue) = IEVault(vault).accountLiquidity(account, false);
        if (liabilityValue > 0) {
            uint256 healthFactor = (collateralValue * 1e18) / liabilityValue;
            if (healthFactor < minHealthFactor) 
                revert HealthFactorTooLow(healthFactor);
        }

        // 2. Calculate delta exposure
        (uint256 baseReserve, uint256 quoteReserve,) = eulerSwap.getReserves();
        int256 delta = int256(baseReserve) - 
            int256((quoteReserve * (10 ** IERC20Metadata(address(baseAsset)).decimals())) / currentPrice);

        // 3. Execute hedge
        if (delta != 0) {
            if (delta > 0) {
                _decreaseBaseExposure(uint256(delta));
            } else {
                _increaseBaseExposure(uint256(-delta));
            }
        }
        
        // Update state
        lastRebalancePrice = currentPrice;
        lastRebalanceTime = block.timestamp;
        emit Rebalanced(delta, currentPrice, block.timestamp);
    }

    // ----- Internal Helpers -----
    function _decreaseBaseExposure(uint256 baseAmount) internal {
        bytes[] memory operations = new bytes[](2);
        
        // Swap base to quote on EulerSwap
        operations[0] = abi.encodeCall(
            eulerSwap.swap,
            (baseAmount, 0, address(this), "")
        );
        
        // Reduce perpetual short
        operations[1] = abi.encodeCall(
            perpExchange.decreaseShort,
            (baseAmount)
        );
        
        IEVC.BatchItem[] memory items = new IEVC.BatchItem[](2);
        items[0] = IEVC.BatchItem({
            targetContract: address(eulerSwap),
            onBehalfOfAccount: account,
            value: 0,
            data: operations[0]
        });
        items[1] = IEVC.BatchItem({
            targetContract: address(perpExchange),
            onBehalfOfAccount: account,
            value: 0,
            data: operations[1]
        });
        evc.batch(items);
    }

    function _increaseBaseExposure(uint256 baseAmount) internal {
        bytes[] memory operations = new bytes[](2);
        
        // Swap quote to base on EulerSwap
        operations[0] = abi.encodeCall(
            eulerSwap.swap,
            (0, baseAmount, address(this), "")
        );
        
        // Increase perpetual short
        operations[1] = abi.encodeCall(
            perpExchange.increaseShort,
            (baseAmount)
        );
        
        IEVC.BatchItem[] memory items = new IEVC.BatchItem[](2);
        items[0] = IEVC.BatchItem({
            targetContract: address(eulerSwap),
            onBehalfOfAccount: account,
            value: 0,
            data: operations[0]
        });
        items[1] = IEVC.BatchItem({
            targetContract: address(perpExchange),
            onBehalfOfAccount: account,
            value: 0,
            data: operations[1]
        });
        evc.batch(items);
    }

    // ----- Emergency Functions -----
    function emergencyClose() external onlyEVC {
        address vault = eulerSwap.getParams().vault0;
        (uint256 collateralValue, uint256 liabilityValue) = IEVault(vault).accountLiquidity(account, false);
        uint256 healthFactor = liabilityValue > 0 ? 
            (collateralValue * 1e18) / liabilityValue : type(uint256).max;
        
        require(healthFactor < minHealthFactor, "Health factor OK");
        
        // Close perpetual position
        (int256 perpSize, , ) = perpExchange.getPosition(account);
        if (perpSize < 0) {
            perpExchange.decreaseShort(uint256(-perpSize));
        }
        
        emit EmergencyClosed(healthFactor);
    }

    // ----- Configuration -----
    function setRebalanceThreshold(uint256 newThresholdBps) external onlyOwner {
        if (newThresholdBps > 10_000) revert InvalidInput();
        rebalanceThresholdBps = newThresholdBps;
        emit ThresholdUpdated(newThresholdBps);
    }

    function setMinHealthFactor(uint256 newHealthFactor) external onlyOwner {
        if (newHealthFactor < 1.1e18) revert InvalidInput();
        minHealthFactor = newHealthFactor;
        emit HealthFactorUpdated(newHealthFactor);
    }

    function setRebalanceCooldown(uint256 newCooldown) external onlyOwner {
        rebalanceCooldown = newCooldown;
    }
}