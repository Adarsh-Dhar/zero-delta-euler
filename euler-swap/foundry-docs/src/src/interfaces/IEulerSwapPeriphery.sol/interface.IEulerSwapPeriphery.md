# IEulerSwapPeriphery
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/interfaces/IEulerSwapPeriphery.sol)


## Functions
### swapExactIn

Swap `amountIn` of `tokenIn` for `tokenOut`, with at least `amountOutMin` received.
Output tokens are sent to `receiver`. The swap will fail after `deadline` (unless `deadline` is 0).
IMPORTANT: `eulerSwap` must be a trusted contract, for example created by a trusted factory.


```solidity
function swapExactIn(
    address eulerSwap,
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    address receiver,
    uint256 amountOutMin,
    uint256 deadline
) external;
```

### swapExactOut

Swap `amountOut` of `tokenOut` for `tokenIn`, with at most `amountInMax` paid.
Output tokens are sent to `receiver`. The swap will fail after `deadline` (unless `deadline` is 0).
IMPORTANT: `eulerSwap` must be a trusted contract, for example created by a trusted factory.


```solidity
function swapExactOut(
    address eulerSwap,
    address tokenIn,
    address tokenOut,
    uint256 amountOut,
    address receiver,
    uint256 amountInMax,
    uint256 deadline
) external;
```

### quoteExactInput

How much `tokenOut` can I get for `amountIn` of `tokenIn`?


```solidity
function quoteExactInput(address eulerSwap, address tokenIn, address tokenOut, uint256 amountIn)
    external
    view
    returns (uint256);
```

### quoteExactOutput

How much `tokenIn` do I need to get `amountOut` of `tokenOut`?


```solidity
function quoteExactOutput(address eulerSwap, address tokenIn, address tokenOut, uint256 amountOut)
    external
    view
    returns (uint256);
```

### getLimits

Upper-bounds on the amounts of each token that this pool can currently support swaps for.


```solidity
function getLimits(address eulerSwap, address tokenIn, address tokenOut)
    external
    view
    returns (uint256 limitIn, uint256 limitOut);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`limitIn`|`uint256`|Max amount of `tokenIn` that can be sold.|
|`limitOut`|`uint256`|Max amount of `tokenOut` that can be bought.|


