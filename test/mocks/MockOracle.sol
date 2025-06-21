// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";

// Mock contracts for testnet deployment
contract MockOracle is Test {
    uint256 public constant ETH_PRICE = 2000e18; // $2000 ETH
    
    function getETHPrice() external pure returns (uint256) {
        return ETH_PRICE;
    }
    
    function getTokenPrice(address) external pure returns (uint256) {
        return 1e18; // $1 for USDC
    }
    
    function getPriceWithTimestamp(address) external view returns (uint256, uint256) {
        return (ETH_PRICE, block.timestamp);
    }
} 