# IEulerSwapFactory
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/interfaces/IEulerSwapFactory.sol)


## Functions
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

*The function can only be called by the Euler account that owns the pool*

*If no pool is installed for the caller, the function returns without any action*


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


### poolByEulerAccount

Returns the pool address associated with a specific holder

*Returns the pool address from the EulerAccountState mapping for the given holder*


```solidity
function poolByEulerAccount(address who) external view returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`who`|`address`|The address of the holder to query|

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


