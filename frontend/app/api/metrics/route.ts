import { NextResponse } from "next/server"
import { ethers, Result } from "ethers"
import { OPERATOR_ABI } from "@/lib/contract/abi/operator"
import { DEFAULT_NEUTRAL_VAULT_ABI } from "@/lib/contract/abi/defaultNeutralVault"
import { REBALANCER_ABI } from "@/lib/contract/abi/rebalancer"
import {
  OPERATOR_ADDRESS,
  VAULT_ADDRESS,
  REBALANCER_ADDRESS,
  USDC_DECIMALS,
  WETH_DECIMALS,
} from "@/lib/contract/address"
import type { ApiResponse, MetricsData } from "@/lib/types"

type HealthMetrics = {
  currentLTV: bigint
  collateralValue: bigint
  debtValue: bigint
  liquidityValue: bigint
  delta: bigint
}

type CallResult<T> = { ok: true; value: T } | { ok: false; error: any }

async function safeCall<T>(promise: Promise<T>): Promise<CallResult<T>> {
  try {
    const value = await promise
    return { ok: true, value }
  } catch (error) {
    console.error("Safe call failed", error)
    return { ok: false, error }
  }
}

// Environment variables
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org"
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL)

// Contract instances
const operatorContract = new ethers.Contract(
  OPERATOR_ADDRESS,
  OPERATOR_ABI,
  provider
)
const vaultContract = new ethers.Contract(
  VAULT_ADDRESS,
  DEFAULT_NEUTRAL_VAULT_ABI,
  provider
)
const rebalancerContract = new ethers.Contract(
  REBALANCER_ADDRESS,
  REBALANCER_ABI,
  provider
)

function formatUSDC(value: bigint): number {
  return parseFloat(ethers.formatUnits(value, USDC_DECIMALS))
}

function formatETH(value: bigint): number {
  return parseFloat(ethers.formatUnits(value, WETH_DECIMALS))
}

export async function GET(): Promise<NextResponse<ApiResponse<MetricsData>>> {
  const calls = [
    safeCall<bigint>(vaultContract.totalSupply()),
    safeCall<bigint>(vaultContract.totalAssets()),
    safeCall<bigint>(operatorContract.ethBorrowed()),
    safeCall<Result>(operatorContract.getHealthMetrics()),
    safeCall<bigint>(rebalancerContract.lastRebalancePrice()),
    safeCall<bigint>(rebalancerContract.rebalanceCount()),
  ]

  const [
    totalSupplyResult,
    totalAssetsResult,
    ethBorrowedResult,
    healthMetricsResult,
    lastRebalancePriceResult,
    rebalanceCountResult,
  ] = await Promise.all(calls)

  const partial =
    !totalSupplyResult.ok ||
    !totalAssetsResult.ok ||
    !ethBorrowedResult.ok ||
    !healthMetricsResult.ok ||
    !lastRebalancePriceResult.ok ||
    !rebalanceCountResult.ok

  const healthMetrics: HealthMetrics = healthMetricsResult.ok
    ? (healthMetricsResult.value as unknown as HealthMetrics)
    : {
        currentLTV: 0n,
        collateralValue: 0n,
        debtValue: 0n,
        liquidityValue: 0n,
        delta: 0n,
      }

  const data: MetricsData = {
    totalSupply: totalSupplyResult.ok ? formatUSDC(totalSupplyResult.value) : 0,
    totalAssets: totalAssetsResult.ok ? formatUSDC(totalAssetsResult.value) : 0,
    ethBorrowed: ethBorrowedResult.ok ? formatETH(ethBorrowedResult.value) : 0,
    collateral: formatUSDC(healthMetrics.collateralValue),
    debt: formatUSDC(healthMetrics.debtValue),
    lastRebalancePrice: lastRebalancePriceResult.ok
      ? formatETH(lastRebalancePriceResult.value)
      : 0,
    rebalanceCount: rebalanceCountResult.ok
      ? Number(rebalanceCountResult.value)
      : 0,
    timestamp: Date.now(),
  }

  return NextResponse.json({
    data,
    success: true,
    partial,
  })
}

// Enable Edge Runtime for better performance
export const runtime = "edge"
