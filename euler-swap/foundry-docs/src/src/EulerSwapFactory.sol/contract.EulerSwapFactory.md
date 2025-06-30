# EulerSwapFactory
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/EulerSwapFactory.sol)

**Inherits:**
[IEulerSwapFactory](/src/interfaces/IEulerSwapFactory.sol/interface.IEulerSwapFactory.md), EVCUtil, [ProtocolFee](/src/utils/ProtocolFee.sol/abstract.ProtocolFee.md)

**Author:**
Euler Labs (https://www.eulerlabs.com/)

**Note:**
security-contact: security@euler.xyz


## State Variables
### evkFactory
*Vaults must be deployed by this factory*


```solidity
address public immutable evkFactory;
```


### eulerSwapImpl
*The EulerSwap code instance that will be proxied to*


```solidity
address public immutable eulerSwapImpl;
```


### installedPools
*Mapping from euler account to pool, if installed*


```solidity
mapping(address eulerAccount => address) internal installedPools;
```


### allPools
*Set of all pool addresses*


```solidity
EnumerableSet.AddressSet internal allPools;
```


### poolMap
*Mapping from sorted pair of underlyings to set of pools*


```solidity
mapping(address asset0 => mapping(address asset1 => EnumerableSet.AddressSet)) internal poolMap;
```


## Functions
### constructor


```solidity
constructor(address evc, address evkFactory_, address eulerSwapImpl_, address feeOwner_, address feeRecipientSetter_)
    EVCUtil(evc)
    ProtocolFee(feeOwner_, feeRecipientSetter_);
```

### deployPool

Deploy a new EulerSwap pool with the given parameters

*The pool address is deterministically generated using CREATE2 with a salt derived from
the euler account address and provided salt parameter. This allows the pool address to be
predicted before deployment.*


```solidity
function deployPool(IEulerSwap.Params memory params, IEulerSwap.InitialState memory initialState, bytes32 salt)
    external
    returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`params`|`IEulerSwap.Params`|Core pool parameters including vaults, account, fees, and curve shape|
|`initialState`|`IEulerSwap.InitialState`|Initial state of the pool|
|`salt`|`bytes32`|Unique value to generate deterministic pool address|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|Address of the newly deployed pool|


### uninstallPool

Uninstalls the pool associated with the Euler account

*This function removes the pool from the factory's tracking and emits a PoolUninstalled event*


```solidity
function uninstallPool() external;
```

### computePoolAddress

Compute the address of a new EulerSwap pool with the given parameters

*The pool address is deterministically generated using CREATE2 with a salt derived from
the euler account address and provided salt parameter. This allows the pool address to be
predicted before deployment.*


```solidity
function computePoolAddress(IEulerSwap.Params memory poolParams, bytes32 salt) external view returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`poolParams`|`IEulerSwap.Params`|Core pool parameters including vaults, account, and fee settings|
|`salt`|`bytes32`|Unique value to generate deterministic pool address|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|Address of the newly deployed pool|


### poolByEulerAccount

Returns the pool address associated with a specific holder

*Returns the pool address from the EulerAccountState mapping for the given holder*


```solidity
function poolByEulerAccount(address eulerAccount) external view returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`eulerAccount`|`address`||

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The address of the pool associated with the holder|


### poolsLength

Returns the total number of deployed pools

*Returns the length of the allPools array*


```solidity
function poolsLength() external view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The total number of pools deployed through the factory|


### poolsSlice

Returns a slice of all deployed pools

*Returns a subset of the pools array from start to end index*


```solidity
function poolsSlice(uint256 start, uint256 end) external view returns (address[] memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`start`|`uint256`|The starting index of the slice (inclusive)|
|`end`|`uint256`|The ending index of the slice (exclusive)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address[]`|An array containing the requested slice of pool addresses|


### pools

Returns all deployed pools

*Returns the complete array of all pool addresses*


```solidity
function pools() external view returns (address[] memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address[]`|An array containing all pool addresses|


### poolsByPairLength

Returns the number of pools for a specific asset pair

*Returns the length of the pool array for the given asset pair*


```solidity
function poolsByPairLength(address asset0, address asset1) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`asset0`|`address`|The address of the first asset|
|`asset1`|`address`|The address of the second asset|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The number of pools for the specified asset pair|


### poolsByPairSlice

Returns a slice of pools for a specific asset pair

*Returns a subset of the pools array for the given asset pair from start to end index*


```solidity
function poolsByPairSlice(address asset0, address asset1, uint256 start, uint256 end)
    external
    view
    returns (address[] memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`asset0`|`address`|The address of the first asset|
|`asset1`|`address`|The address of the second asset|
|`start`|`uint256`|The starting index of the slice (inclusive)|
|`end`|`uint256`|The ending index of the slice (exclusive)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address[]`|An array containing the requested slice of pool addresses for the asset pair|


### poolsByPair

Returns all pools for a specific asset pair

*Returns the complete array of pool addresses for the given asset pair*


```solidity
function poolsByPair(address asset0, address asset1) external view returns (address[] memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`asset0`|`address`|The address of the first asset|
|`asset1`|`address`|The address of the second asset|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address[]`|An array containing all pool addresses for the specified asset pair|


### updateEulerAccountState

Validates operator authorization for euler account and update the relevant EulerAccountState.


```solidity
function updateEulerAccountState(address eulerAccount, address newOperator) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`eulerAccount`|`address`|The address of the euler account.|
|`newOperator`|`address`|The address of the new pool.|


### uninstall

Uninstalls the pool associated with the given Euler account

*This function removes the pool from the factory's tracking and emits a PoolUninstalled event*

*The function checks if the operator is still installed and reverts if it is*

*If no pool exists for the account, the function returns without any action*


```solidity
function uninstall(address eulerAccount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`eulerAccount`|`address`|The address of the Euler account whose pool should be uninstalled|


### getSlice

Returns a slice of an array of addresses

*Creates a new memory array containing elements from start to end index
If end is type(uint256).max, it will return all elements from start to the end of the array*


```solidity
function getSlice(EnumerableSet.AddressSet storage arr, uint256 start, uint256 end)
    internal
    view
    returns (address[] memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`arr`|`EnumerableSet.AddressSet`|The storage array to slice|
|`start`|`uint256`|The starting index of the slice (inclusive)|
|`end`|`uint256`|The ending index of the slice (exclusive)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address[]`|A new memory array containing the requested slice of addresses|


### _eulerSwapImpl


```solidity
function _eulerSwapImpl() internal view override returns (address);
```

## Events
### PoolDeployed

```solidity
event PoolDeployed(address indexed asset0, address indexed asset1, address indexed eulerAccount, address pool);
```

### PoolConfig

```solidity
event PoolConfig(address indexed pool, IEulerSwap.Params params, IEulerSwap.InitialState initialState);
```

### PoolUninstalled

```solidity
event PoolUninstalled(address indexed asset0, address indexed asset1, address indexed eulerAccount, address pool);
```

## Errors
### InvalidQuery

```solidity
error InvalidQuery();
```

### Unauthorized

```solidity
error Unauthorized();
```

### OldOperatorStillInstalled

```solidity
error OldOperatorStillInstalled();
```

### OperatorNotInstalled

```solidity
error OperatorNotInstalled();
```

### InvalidVaultImplementation

```solidity
error InvalidVaultImplementation();
```

### SliceOutOfBounds

```solidity
error SliceOutOfBounds();
```

### InvalidProtocolFee

```solidity
error InvalidProtocolFee();
```

