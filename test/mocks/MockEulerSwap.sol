// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockEulerSwap {
    uint256 public totalLiquidity = 1000000e18;
    
    function addLiquidity(address, address, uint256, uint256, uint256) 
        external 
        pure 
        returns (uint256) 
    {
        return 1000e18; // Mock liquidity tokens
    }
    
    function addLiquidityETH(uint256, uint256) external pure returns (uint256) {
        return 1000e18;
    }
    
    function removeLiquidity(address, address, uint256, uint256, uint256) 
        external 
        pure 
        returns (uint256, uint256) 
    {
        return (1e18, 2000e6); // 1 ETH, 2000 USDC
    }
    
    function swap(address, address, uint256 amountIn) external pure returns (uint256) {
        return amountIn / 2000; // Simple 1:2000 ratio
    }
    
    function getReserve(address) external pure returns (uint256) {
        return 1000e18;
    }
    
    function getLiquidityValue(uint256) external pure returns (uint256) {
        return 1000e6; // $1000 value
    }
    
    function getAmountOut(address, address, uint256 amountIn) 
        external 
        pure 
        returns (uint256) 
    {
        return amountIn / 2000;
    }
} 