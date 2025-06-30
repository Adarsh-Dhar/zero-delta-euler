# IEulerSwapCallee
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/interfaces/IEulerSwapCallee.sol)


## Functions
### eulerSwapCall

If non-empty data is provided to `swap()`, then this callback function
is invoked on the `to` address, allowing flash-swaps (withdrawing output before
sending input.

*This callback mechanism is designed to be as similar as possible to Uniswap2.*


```solidity
function eulerSwapCall(address sender, uint256 amount0, uint256 amount1, bytes calldata data) external;
```

