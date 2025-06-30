# Swap
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/Events.sol)

Emitted after every swap.
* `sender` is the initiator of the swap, or the Router when invoked via hook.
* `amount0In` and `amount1In` are after fees have been subtracted.
* `reserve0` and `reserve1` are the pool's new reserves (after the swap).
* `to` is the specified recipient of the funds, or the PoolManager when invoked via hook.


```solidity
event Swap(
    address indexed sender,
    uint256 amount0In,
    uint256 amount1In,
    uint256 amount0Out,
    uint256 amount1Out,
    uint112 reserve0,
    uint112 reserve1,
    address indexed to
);
```

