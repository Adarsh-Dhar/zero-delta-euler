# ProtocolFee
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/utils/ProtocolFee.sol)

**Inherits:**
Owned


## State Variables
### protocolFee

```solidity
uint256 public protocolFee;
```


### protocolFeeRecipient

```solidity
address public protocolFeeRecipient;
```


### recipientSetter

```solidity
address public immutable recipientSetter;
```


### deploymentTimestamp

```solidity
uint256 public immutable deploymentTimestamp;
```


### MIN_PROTOCOL_FEE

```solidity
uint256 public constant MIN_PROTOCOL_FEE = 0.1e18;
```


### MAX_PROTOCOL_FEE

```solidity
uint256 public constant MAX_PROTOCOL_FEE = 0.25e18;
```


## Functions
### constructor


```solidity
constructor(address _feeOwner, address _recipientSetter) Owned(_feeOwner);
```

### _eulerSwapImpl


```solidity
function _eulerSwapImpl() internal view virtual returns (address);
```

### _poolManager


```solidity
function _poolManager() internal view returns (IPoolManager);
```

### enableProtocolFee

Permissionlessly enable a minimum protocol fee after 1 year

*All of the following conditions must be met:
EulerSwap is deployed on a chain with Uniswap v4
The protocol fee can only be enabled after 1 year of deployment
The fee recipient MUST be specified
The protocol fee was not previously set*


```solidity
function enableProtocolFee() external;
```

### setProtocolFee

Set the protocol fee, expressed as a percentage of LP fee


```solidity
function setProtocolFee(uint256 newFee) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newFee`|`uint256`|The new protocol fee, in WAD units (0.10e18 = 10%)|


### setProtocolFeeRecipient


```solidity
function setProtocolFeeRecipient(address newRecipient) external;
```

## Events
### ProtocolFeeSet

```solidity
event ProtocolFeeSet(uint256 protocolFee);
```

### ProtocolFeeRecipientSet

```solidity
event ProtocolFeeRecipientSet(address protocolFeeRecipient);
```

## Errors
### InvalidFee

```solidity
error InvalidFee();
```

### RecipientSetAlready

```solidity
error RecipientSetAlready();
```

