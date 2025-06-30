# FundsLib
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/libraries/FundsLib.sol)


## Functions
### approveVault

Approves tokens for a given vault, supporting both standard approvals and permit2


```solidity
function approveVault(address vault) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`vault`|`address`|The address of the vault to approve the token for|


### withdrawAssets

Withdraws assets from a vault, first using available balance and then borrowing if needed

*This function first checks if there's an existing balance in the vault.*

*If there is, it withdraws the minimum of the requested amount and available balance.*

*If more assets are needed after withdrawal, it enables the controller and borrows the remaining amount.*


```solidity
function withdrawAssets(address evc, IEulerSwap.Params memory p, address vault, uint256 amount, address to) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`evc`|`address`|EVC instance|
|`p`|`IEulerSwap.Params`|EulerSwap parameters|
|`vault`|`address`|The address of the vault to withdraw from|
|`amount`|`uint256`|The total amount of assets to withdraw|
|`to`|`address`|The address that will receive the withdrawn assets|


### depositAssets

Deposits assets into a vault and automatically repays any outstanding debt

*This function attempts to deposit assets into the specified vault.*

*If the deposit fails with E_ZeroShares error, it safely returns 0 (this happens with very small amounts).*

*After successful deposit, if the user has any outstanding controller-enabled debt, it attempts to repay it.*

*If all debt is repaid, the controller is automatically disabled to reduce gas costs in future operations.*


```solidity
function depositAssets(address evc, IEulerSwap.Params memory p, address vault) internal returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`evc`|`address`|EVC instance|
|`p`|`IEulerSwap.Params`|EulerSwap parameters|
|`vault`|`address`|The address of the vault to deposit into|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of assets successfully deposited|


## Errors
### DepositFailure

```solidity
error DepositFailure(bytes reason);
```

