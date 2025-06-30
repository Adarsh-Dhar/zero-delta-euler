# MetaProxyDeployer
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/utils/MetaProxyDeployer.sol)

**Author:**
Euler Labs (https://www.eulerlabs.com/)

Contract for deploying minimal proxies with metadata, based on EIP-3448.

*The metadata of the proxies does not include the data length as defined by EIP-3448, saving gas at a cost of
supporting variable size data.*

*This was adapted from the Euler Vault Kit's implementation to use CREATE2*

**Note:**
security-contact: security@euler.xyz


## State Variables
### BYTECODE_HEAD

```solidity
bytes constant BYTECODE_HEAD = hex"600b380380600b3d393df3363d3d373d3d3d3d60368038038091363936013d73";
```


### BYTECODE_TAIL

```solidity
bytes constant BYTECODE_TAIL = hex"5af43d3d93803e603457fd5bf3";
```


## Functions
### creationCodeMetaProxy

*Computes the creation code*


```solidity
function creationCodeMetaProxy(address targetContract, bytes memory metadata) internal pure returns (bytes memory);
```

### deployMetaProxy

*Creates a proxy for `targetContract` with metadata from `metadata`.*


```solidity
function deployMetaProxy(address targetContract, bytes memory metadata, bytes32 salt) internal returns (address addr);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`addr`|`address`|A non-zero address if successful.|


## Errors
### E_DeploymentFailed

```solidity
error E_DeploymentFailed();
```

