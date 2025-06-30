# QuoteLib
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/libraries/QuoteLib.sol)


## Functions
### computeQuote

*Computes the quote for a swap by applying fees and validating state conditions*

*Validates:
- EulerSwap operator is installed
- Token pair is supported
- Sufficient reserves exist
- Sufficient cash is available*


```solidity
function computeQuote(address evc, IEulerSwap.Params memory p, bool asset0IsInput, uint256 amount, bool exactIn)
    internal
    view
    returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`evc`|`address`|EVC instance|
|`p`|`IEulerSwap.Params`|The EulerSwap params|
|`asset0IsInput`|`bool`|Swap direction|
|`amount`|`uint256`|The amount to quote (input amount if exactIn=true, output amount if exactIn=false)|
|`exactIn`|`bool`|True if quoting for exact input amount, false if quoting for exact output amount|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The quoted amount (output amount if exactIn=true, input amount if exactIn=false)|


### calcLimits

Calculates the maximum input and output amounts for a swap based on protocol constraints

*Determines limits by checking multiple factors:
1. Supply caps and existing debt for the input token
2. Available reserves in the EulerSwap for the output token
3. Available cash and borrow caps for the output token
4. Account balances in the respective vaults*


```solidity
function calcLimits(IEulerSwap.Params memory p, bool asset0IsInput) internal view returns (uint256, uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`p`|`IEulerSwap.Params`|The EulerSwap params|
|`asset0IsInput`|`bool`|Boolean indicating whether asset0 (true) or asset1 (false) is the input token|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|uint256 Maximum amount of input token that can be deposited|
|`<none>`|`uint256`|uint256 Maximum amount of output token that can be withdrawn|


### decodeCap

Decodes a compact-format cap value to its actual numerical value

*The cap uses a compact-format where:
- If amountCap == 0, there's no cap (returns max uint256)
- Otherwise, the lower 6 bits represent the exponent (10^exp)
- The upper bits (>> 6) represent the mantissa
- The formula is: (10^exponent * mantissa) / 100*

**Note:**
security: Uses unchecked math for gas optimization as calculations cannot overflow:
maximum possible value 10^(2^6-1) * (2^10-1) ≈ 1.023e+66 < 2^256


```solidity
function decodeCap(uint256 amountCap) internal pure returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amountCap`|`uint256`|The compact-format cap value to decode|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The actual numerical cap value (type(uint256).max if uncapped)|


### checkTokens

Verifies that the given tokens are supported by the EulerSwap pool and determines swap direction

*Returns a boolean indicating whether the input token is asset0 (true) or asset1 (false)*

**Note:**
error: UnsupportedPair Thrown if the token pair is not supported by the EulerSwap pool


```solidity
function checkTokens(IEulerSwap.Params memory p, address tokenIn, address tokenOut)
    internal
    view
    returns (bool asset0IsInput);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`p`|`IEulerSwap.Params`|The EulerSwap params|
|`tokenIn`|`address`|The input token address for the swap|
|`tokenOut`|`address`|The output token address for the swap|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`asset0IsInput`|`bool`|True if tokenIn is asset0 and tokenOut is asset1, false if reversed|


### findCurvePoint


```solidity
function findCurvePoint(IEulerSwap.Params memory p, uint256 amount, bool exactIn, bool asset0IsInput)
    internal
    view
    returns (uint256 output);
```

## Errors
### UnsupportedPair

```solidity
error UnsupportedPair();
```

### OperatorNotInstalled

```solidity
error OperatorNotInstalled();
```

### SwapLimitExceeded

```solidity
error SwapLimitExceeded();
```

