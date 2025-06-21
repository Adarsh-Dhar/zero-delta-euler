// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockEuler {
    mapping(address => mapping(address => uint256)) public deposits;
    mapping(address => mapping(address => uint256)) public debts;
    
    function deposit(address token, uint256 amount) external {
        deposits[msg.sender][token] += amount;
    }
    
    function withdraw(address token, uint256 amount) external {
        deposits[msg.sender][token] -= amount;
    }
    
    function borrow(address token, uint256 amount) external {
        debts[msg.sender][token] += amount;
    }
    
    function repay(address token, uint256 amount) external {
        debts[msg.sender][token] -= amount;
    }
    
    function getDebt(address token) external view returns (uint256) {
        return debts[msg.sender][token];
    }
    
    function getDebtValue(address token) external view returns (uint256) {
        return debts[msg.sender][token] * 2000; // Assume $2000 ETH
    }
    
    function getCollateralValue(address token) external view returns (uint256) {
        return deposits[msg.sender][token]; // Assume $1 USDC
    }
    
    function healthScore(address) external pure returns (uint256) {
        return 100; // Always healthy
    }
    
    function maxLTV(address) external pure returns (uint256) {
        return 75; // 75% max LTV
    }
} 