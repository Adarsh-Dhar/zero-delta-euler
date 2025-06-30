# EulerSwapActivated
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/Events.sol)

Emitted upon EulerSwap instance creation.
* `asset0` and `asset1` are the underlying assets of the vaults.
They are always in lexical order: `asset0 < asset1`.


```solidity
event EulerSwapActivated(address indexed asset0, address indexed asset1);
```

