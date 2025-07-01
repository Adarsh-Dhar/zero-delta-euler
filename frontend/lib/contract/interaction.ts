import { readContract, writeContract, simulateContract } from 'wagmi/actions'
import { FactoryAbi } from './abi/Factory'
import { PeripheryAbi } from './abi/Periphery'
import { SwapAbi } from './abi/Swap'
import { FactoryAddress, PeripheryAddress, SwapAddress } from './address'
import { Address, Hex } from 'viem'
import { config } from '@/app/providers'

// --------------------
// Factory Contract
// --------------------

// Deploys new AMM pool
export async function deployPool(params: any, initialState: any, salt: Hex, account: Address) {
  const result = await writeContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'deployPool',
    args: [params, initialState, salt],
    account,
  })
  console.log('deployPool result:', result)
  return result
}

// Removes pool association
export async function uninstallPool(account: Address) {
  const result = await writeContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'uninstallPool',
    args: [],
    account,
  })
  console.log('uninstallPool result:', result)
  return result
}

// Calculates deterministic pool address
export async function computePoolAddress(params: any, salt: Hex) {
  const result = await readContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'computePoolAddress',
    args: [params, salt],
  })
  console.log('computePoolAddress result:', result)
  return result
}

// View functions for pool discovery
export async function poolByEulerAccount(eulerAccount: Address) {
  const result = await readContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'poolByEulerAccount',
    args: [eulerAccount],
  })
  console.log('poolByEulerAccount result:', result)
  return result
}

export async function poolsLength() {
  const result = await readContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'poolsLength',
    args: [],
  })
  console.log('poolsLength result:', result)
  return result
}

export async function poolsSlice(start: bigint, end: bigint) {
  const result = await readContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'poolsSlice',
    args: [start, end],
  })
  console.log('poolsSlice result:', result)
  return result
}

export async function pools() {
  const result = await readContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'pools',
    args: [],
  })
  console.log('pools result:', result)
  return result
}

export async function poolsByPairLength(asset0: Address, asset1: Address) {
  const result = await readContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'poolsByPairLength',
    args: [asset0, asset1],
  })
  console.log('poolsByPairLength result:', result)
  return result
}

export async function poolsByPairSlice(asset0: Address, asset1: Address, start: bigint, end: bigint) {
  const result = await readContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'poolsByPairSlice',
    args: [asset0, asset1, start, end],
  })
  console.log('poolsByPairSlice result:', result)
  return result
}

export async function poolsByPair(asset0: Address, asset1: Address) {
  const result = await readContract(config, {
    address: FactoryAddress,
    abi: FactoryAbi,
    functionName: 'poolsByPair',
    args: [asset0, asset1],
  })
  console.log('poolsByPair result:', result)
  return result
}

// --------------------
// Core AMM Contract (EulerSwap)
// --------------------

// Initializes pool after deployment
export async function activate(initialState: any, account: Address) {
  const result = await writeContract(config, {
    address: SwapAddress,
    abi: SwapAbi,
    functionName: 'activate',
    args: [initialState],
    account,
  })
  console.log('activate result:', result)
  return result
}

// Returns pool parameters
export async function getParams() {
  const result = await readContract(config, {
    address: SwapAddress,
    abi: SwapAbi,
    functionName: 'getParams',
    args: [],
  })
  console.log('getParams result:', result)
  return result
}

// Returns underlying assets
export async function getAssets() {
  const result = await readContract(config, {
    address: SwapAddress,
    abi: SwapAbi,
    functionName: 'getAssets',
    args: [],
  })
  console.log('getAssets result:', result)
  return result
}

// Returns reserve balances
export async function getReserves() {
  const result = await readContract(config, {
    address: SwapAddress,
    abi: SwapAbi,
    functionName: 'getReserves',
    args: [],
  })
  console.log('getReserves result:', result)
  return result
}

// Calculates swap amounts
export async function computeQuote(tokenIn: Address, tokenOut: Address, amount: bigint, exactIn: boolean) {
  const result = await readContract(config, {
    address: SwapAddress,
    abi: SwapAbi,
    functionName: 'computeQuote',
    args: [tokenIn, tokenOut, amount, exactIn],
  })
  console.log('computeQuote result:', result)
  return result
}

// Returns swap limits
export async function getLimits(tokenIn: Address, tokenOut: Address) {
  const result = await readContract(config, {
    address: SwapAddress,
    abi: SwapAbi,
    functionName: 'getLimits',
    args: [tokenIn, tokenOut],
  })
  console.log('getLimits result:', result)
  return result
}

// Executes token swaps (low-level)
export async function swap(amount0Out: bigint, amount1Out: bigint, to: Address, data: Hex, account: Address) {
  const result = await writeContract(config, {
    address: SwapAddress,
    abi: SwapAbi,
    functionName: 'swap',
    args: [amount0Out, amount1Out, to, data],
    account,
  })
  console.log('swap result:', result)
  return result
}

// --------------------
// Periphery Contract
// --------------------

// Swap exact input tokens
export async function swapExactIn(
  eulerSwap: Address,
  tokenIn: Address,
  tokenOut: Address,
  amountIn: bigint,
  receiver: Address,
  amountOutMin: bigint,
  deadline: bigint,
  account: Address
) {
  const result = await writeContract(config, {
    address: PeripheryAddress,
    abi: PeripheryAbi,
    functionName: 'swapExactIn',
    args: [eulerSwap, tokenIn, tokenOut, amountIn, receiver, amountOutMin, deadline],
    account,
  })
  console.log('swapExactIn result:', result)
  return result
}

// Swap for exact output tokens
export async function swapExactOut(
  eulerSwap: Address,
  tokenIn: Address,
  tokenOut: Address,
  amountOut: bigint,
  receiver: Address,
  amountInMax: bigint,
  deadline: bigint,
  account: Address
) {
  const result = await writeContract(config, {
    address: PeripheryAddress,
    abi: PeripheryAbi,
    functionName: 'swapExactOut',
    args: [eulerSwap, tokenIn, tokenOut, amountOut, receiver, amountInMax, deadline],
    account,
  })
  console.log('swapExactOut result:', result)
  return result
}

// Quote calculations
export async function quoteExactInput(eulerSwap: Address, tokenIn: Address, tokenOut: Address, amountIn: bigint) {
  const result = await readContract(config, {
    address: PeripheryAddress,
    abi: PeripheryAbi,
    functionName: 'quoteExactInput',
    args: [eulerSwap, tokenIn, tokenOut, amountIn],
  })
  console.log('quoteExactInput result:', result)
  return result
}

export async function quoteExactOutput(eulerSwap: Address, tokenIn: Address, tokenOut: Address, amountOut: bigint) {
  const result = await readContract(config, {
    address: PeripheryAddress,
    abi: PeripheryAbi,
    functionName: 'quoteExactOutput',
    args: [eulerSwap, tokenIn, tokenOut, amountOut],
  })
  console.log('quoteExactOutput result:', result)
  return result
}

// Get swap limits
export async function getPeripheryLimits(eulerSwap: Address, tokenIn: Address, tokenOut: Address) {
  const result = await readContract(config, {
    address: PeripheryAddress,
    abi: PeripheryAbi,
    functionName: 'getLimits',
    args: [eulerSwap, tokenIn, tokenOut],
  })
  console.log('getPeripheryLimits result:', result)
  return result
}
