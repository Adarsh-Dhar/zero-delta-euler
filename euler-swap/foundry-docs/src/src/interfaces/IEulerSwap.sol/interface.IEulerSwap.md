# IEulerSwap
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/interfaces/IEulerSwap.sol)


## Functions
### activate

Performs initial activation setup, such as approving vaults to access the
EulerSwap instance's tokens, enabling vaults as collateral, setting up Uniswap
hooks, etc. This should only be invoked by the factory.


```solidity
function activate(InitialState calldata initialState) external;
```

### getParams

Retrieves the pool's immutable parameters.


```solidity
function getParams() external view returns (Params memory);
```

### getAssets

Retrieves the underlying assets supported by this pool.


```solidity
function getAssets() external view returns (address asset0, address asset1);
```

### getReserves

Retrieves the current reserves from storage, along with the pool's lock status.


```solidity
function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 status);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`reserve0`|`uint112`|The amount of asset0 in the pool|
|`reserve1`|`uint112`|The amount of asset1 in the pool|
|`status`|`uint32`|The status of the pool (0 = unactivated, 1 = unlocked, 2 = locked)|


### computeQuote

Generates a quote for how much a given size swap will cost.


```solidity
function computeQuote(address tokenIn, address tokenOut, uint256 amount, bool exactIn)
    external
    view
    returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`tokenIn`|`address`|The input token that the swapper SENDS|
|`tokenOut`|`address`|The output token that the swapper GETS|
|`amount`|`uint256`|The quantity of input or output tokens, for exact input and exact output swaps respectively|
|`exactIn`|`bool`|True if this is an exact input swap, false if exact output|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The quoted quantity of output or input tokens, for exact input and exact output swaps respectively|


### getLimits

Upper-bounds on the amounts of each token that this pool can currently support swaps for.


```solidity
function getLimits(address tokenIn, address tokenOut) external view returns (uint256 limitIn, uint256 limitOut);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`limitIn`|`uint256`|Max amount of `tokenIn` that can be sold.|
|`limitOut`|`uint256`|Max amount of `tokenOut` that can be bought.|


### swap

Optimistically sends the requested amounts of tokens to the `to`
address, invokes `eulerSwapCall` callback on `to` (if `data` was provided),
and then verifies that a sufficient amount of tokens were transferred to
satisfy the swapping curve invariant.


```solidity
function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes calldata data) external;
```

## Structs
### Params
*Immutable pool parameters. Passed to the instance via proxy trailing data.*


```solidity
struct Params {
    address vault0;
    address vault1;
    address eulerAccount;
    uint112 equilibriumReserve0;
    uint112 equilibriumReserve1;
    uint256 priceX;
    uint256 priceY;
    uint256 concentrationX;
    uint256 concentrationY;
    uint256 fee;
    uint256 protocolFee;
    address protocolFeeRecipient;
}
```

### InitialState
*Starting configuration of pool storage.*


```solidity
struct InitialState {
    uint112 currReserve0;
    uint112 currReserve1;
}
```

