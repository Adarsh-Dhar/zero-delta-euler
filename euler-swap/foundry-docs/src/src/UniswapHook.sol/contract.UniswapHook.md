# UniswapHook
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/UniswapHook.sol)

**Inherits:**
BaseHook


## State Variables
### evc

```solidity
address private immutable evc;
```


### _poolKey

```solidity
PoolKey internal _poolKey;
```


## Functions
### constructor


```solidity
constructor(address evc_, address _poolManager) BaseHook(IPoolManager(_poolManager));
```

### activateHook


```solidity
function activateHook(IEulerSwap.Params memory p) internal;
```

### poolKey

*Helper function to return the poolKey as its struct type*


```solidity
function poolKey() external view returns (PoolKey memory);
```

### validateHookAddress

*Prevent hook address validation in constructor, which is not needed
because hook instances are proxies. Instead, the address is validated
in activateHook().*


```solidity
function validateHookAddress(BaseHook _this) internal pure override;
```

### nonReentrantHook


```solidity
modifier nonReentrantHook();
```

### _beforeSwap


```solidity
function _beforeSwap(address sender, PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata)
    internal
    override
    nonReentrantHook
    returns (bytes4, BeforeSwapDelta, uint24);
```

### getHookPermissions


```solidity
function getHookPermissions() public pure override returns (Hooks.Permissions memory);
```

## Errors
### LockedHook

```solidity
error LockedHook();
```

