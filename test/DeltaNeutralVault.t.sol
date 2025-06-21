// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DeltaNeutralVault} from "../contract/src/DeltaNeutralVault.sol";
import {Operator} from "../contract/src/Operator.sol";
import {Rebalancer} from "../contract/src/Rebalancer.sol";
import {MockOracle} from "./mocks/MockOracle.sol";
import {MockEuler} from "./mocks/MockEuler.sol";
import {MockEulerSwap} from "./mocks/MockEulerSwap.sol";

contract DeltaNeutralVaultTest is Test {
    // Constants from Deploy script
    address constant USDC_ADDRESS = 0xA0b86A33e6441c8c7dbf84E6f7B9fd8E7d8B8D29;
    address constant WETH_ADDRESS = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    string constant VAULT_NAME = "Delta Neutral ETH-USDC Vault";
    string constant VAULT_SYMBOL = "dnETH-USDC";

    // Contracts
    DeltaNeutralVault public vault;
    Operator public operator;
    Rebalancer public rebalancer;
    MockOracle public oracle;
    MockEuler public euler;
    MockEulerSwap public eulerSwap;

    function setUp() public {
        // Deploy Mocks
        oracle = new MockOracle();
        euler = new MockEuler();
        eulerSwap = new MockEulerSwap();

        // Deploy Main Contracts
        rebalancer = new Rebalancer(address(oracle), address(this));
        operator = new Operator(
            USDC_ADDRESS,
            WETH_ADDRESS,
            address(euler),
            address(eulerSwap),
            address(oracle)
        );
        vault = new DeltaNeutralVault(
            USDC_ADDRESS,
            VAULT_NAME,
            VAULT_SYMBOL
        );

        // Configure contracts
        vault.setOperator(address(operator));
        vault.setRebalancer(address(rebalancer));
        operator.setVault(address(vault));
        rebalancer.setVault(address(vault));
    }

    function testInitialState() public {
        assertEq(address(vault.USDC()), USDC_ADDRESS);
        assertEq(vault.name(), VAULT_NAME);
        assertEq(vault.symbol(), VAULT_SYMBOL);
        assertEq(address(vault.operator()), address(operator));
        assertEq(address(vault.rebalancer()), address(rebalancer));
    }
} 