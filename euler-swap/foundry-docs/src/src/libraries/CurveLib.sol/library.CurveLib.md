# CurveLib
[Git Source](https://github.com/euler-xyz/euler-swap/blob/7080c3fe0c9f935c05849a0756ed43d959130afd/src/libraries/CurveLib.sol)


## Functions
### verify

Returns true if the specified reserve amounts would be acceptable, false otherwise.
Acceptable points are on, or above and to-the-right of the swapping curve.


```solidity
function verify(IEulerSwap.Params memory p, uint256 newReserve0, uint256 newReserve1) internal pure returns (bool);
```

### f

Computes the output `y` for a given input `x`.

*EulerSwap curve*


```solidity
function f(uint256 x, uint256 px, uint256 py, uint256 x0, uint256 y0, uint256 c) internal pure returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`x`|`uint256`|The input reserve value, constrained to 1 <= x <= x0.|
|`px`|`uint256`|(1 <= px <= 1e25).|
|`py`|`uint256`|(1 <= py <= 1e25).|
|`x0`|`uint256`|(1 <= x0 <= 2^112 - 1).|
|`y0`|`uint256`|(0 <= y0 <= 2^112 - 1).|
|`c`|`uint256`|(0 <= c <= 1e18).|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|y The output reserve value corresponding to input `x`, guaranteed to satisfy `y0 <= y <= 2^112 - 1`.|


### fInverse

Computes the output `x` for a given input `y`.

*EulerSwap inverse curve*


```solidity
function fInverse(uint256 y, uint256 px, uint256 py, uint256 x0, uint256 y0, uint256 c)
    internal
    pure
    returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`y`|`uint256`|The input reserve value, constrained to y0 <= y <= 2^112 - 1.|
|`px`|`uint256`|(1 <= px <= 1e25).|
|`py`|`uint256`|(1 <= py <= 1e25).|
|`x0`|`uint256`|(1 <= x0 <= 2^112 - 1).|
|`y0`|`uint256`|(0 <= y0 <= 2^112 - 1).|
|`c`|`uint256`|(0 <= c <= 1e18).|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|x The output reserve value corresponding to input `y`, guaranteed to satisfy `1 <= x <= x0`.|


### computeScale

*Utility to derive optimal scale for computations in fInverse*


```solidity
function computeScale(uint256 x) internal pure returns (uint256 scale);
```

## Errors
### Overflow

```solidity
error Overflow();
```

### CurveViolation

```solidity
error CurveViolation();
```

