# CtxLib
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/libraries/CtxLib.sol)


## State Variables
### CtxStorageLocation

```solidity
bytes32 internal constant CtxStorageLocation = 0xae890085f98619e96ae34ba28d74baa4a4f79785b58fd4afcd3dc0338b79df91;
```


## Functions
### getStorage


```solidity
function getStorage() internal pure returns (Storage storage s);
```

### getParams

*Unpacks encoded Params from trailing calldata. Loosely based on
the implementation from EIP-3448 (except length is hard-coded).
384 is the size of the Params struct after ABI encoding.*


```solidity
function getParams() internal pure returns (IEulerSwap.Params memory p);
```

## Errors
### InsufficientCalldata

```solidity
error InsufficientCalldata();
```

## Structs
### Storage

```solidity
struct Storage {
    uint112 reserve0;
    uint112 reserve1;
    uint32 status;
}
```

