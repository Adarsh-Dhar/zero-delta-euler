import { NextResponse } from "next/server"
import { ethers } from "ethers"
import type { MetricsData, ApiResponse } from "@/lib/types"

// Contract ABI - minimal interface for the required functions
const CONTRACT_ABI = [
  "function totalSupply() view returns (uint256)",
  "function totalAssets() view returns (uint256)",
  "function getEthBorrowed() view returns (uint256)",
  "function getCollateral() view returns (uint256)",
  "function getDebt() view returns (uint256)",
  "function lastRebalancePrice() view returns (uint256)",
  "function rebalanceCount() view returns (uint256)",
]

// Add just below the ABI & env var block
type CallResult<T> = { ok: true; value: T } | { ok: false }

async function safeCall<T>(promise: Promise<T>): Promise<CallResult<T>> {
  try {
    const value = await promise
    return { ok: true, value }
  } catch (err) {
    console.warn("[metrics] call reverted →", (err as Error).message)
    return { ok: false }
  }
}

// Environment variables
const RPC_URL = process.env.RPC_URL
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const USDC_DECIMALS = 6
const ETH_DECIMALS = 18

if (!RPC_URL) {
  throw new Error("RPC_URL environment variable is required")
}

if (!CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS environment variable is required")
}

// Initialize provider and contract
const provider = new ethers.JsonRpcProvider(RPC_URL)
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

function formatUSDC(value: bigint): number {
  return Number(ethers.formatUnits(value, USDC_DECIMALS))
}

function formatETH(value: bigint): number {
  return Number(ethers.formatUnits(value, ETH_DECIMALS))
}

export async function GET(): Promise<NextResponse<ApiResponse<MetricsData>>> {
  try {
    // Replace the current multi-call block inside GET()
    const [
      totalSupplyRes,
      totalAssetsRes,
      ethBorrowedRes,
      collateralRes,
      debtRes,
      lastRebalancePriceRes,
      rebalanceCountRes,
    ] = await Promise.all([
      safeCall(contract.totalSupply()),
      safeCall(contract.totalAssets()),
      safeCall(contract.getEthBorrowed?.() ?? Promise.reject("getEthBorrowed() not found")),
      safeCall(contract.getCollateral?.() ?? Promise.reject("getCollateral() not found")),
      safeCall(contract.getDebt?.() ?? Promise.reject("getDebt() not found")),
      safeCall(contract.lastRebalancePrice()),
      safeCall(contract.rebalanceCount()),
    ])

    // Build the `metricsData` using available values and sane fallbacks.
    const metricsData: MetricsData = {
      totalSupply: totalSupplyRes.ok ? formatUSDC(totalSupplyRes.value as bigint) : 0,
      totalAssets: totalAssetsRes.ok ? formatUSDC(totalAssetsRes.value as bigint) : 0,
      ethBorrowed: ethBorrowedRes.ok ? formatETH(ethBorrowedRes.value as bigint) : 0,
      collateral: collateralRes.ok ? formatUSDC(collateralRes.value as bigint) : 0,
      debt: debtRes.ok ? formatUSDC(debtRes.value as bigint) : 0,
      lastRebalancePrice: lastRebalancePriceRes.ok ? formatUSDC(lastRebalancePriceRes.value as bigint) : 0,
      rebalanceCount: rebalanceCountRes.ok ? Number(rebalanceCountRes.value) : 0,
      timestamp: Date.now(),
    }

    return NextResponse.json({
      success: true,
      data: metricsData,
      partial: !(
        totalSupplyRes.ok &&
        totalAssetsRes.ok &&
        ethBorrowedRes.ok &&
        collateralRes.ok &&
        debtRes.ok &&
        lastRebalancePriceRes.ok &&
        rebalanceCountRes.ok
      ),
    })
  } catch (error) {
    console.error("Error fetching metrics from contract:", error)

    const errorMessage = error instanceof Error ? error.message : "Failed to fetch metrics from smart contract"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

// Enable Edge Runtime for better performance
export const runtime = "edge"
