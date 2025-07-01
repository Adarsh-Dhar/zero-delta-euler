import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

// GET /api/pools - List all pools
export async function GET() {
  try {
    const pools = await (prisma.pool.findMany as any)({ 
      orderBy: { createdAt: "desc" },
      include: { transactions: true }
    })
    return NextResponse.json(pools)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pools" }, { status: 500 })
  }
}

// POST /api/pools - Create a new pool
export async function POST(req: Request) {
  try {
    const data = await req.json()
    // Validate required fields
    const requiredFields = ["token0", "token1", "feeTier", "concentration", "owner"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }
    // Map fields to correct types and allow new fields
    const poolData = {
      token0: data.token0,
      token1: data.token1,
      feeTier: parseFloat(data.feeTier),
      concentration: data.concentration,
      owner: data.owner,
      tvl: data.tvl ?? 0,
      volume24h: data.volume24h ?? 0,
      apr: data.apr ?? 0,
      feesCollected: data.feesCollected ?? 0,
      reserveRatios: data.reserveRatios ?? "",
      ltvRatio: data.ltvRatio ?? 0,
      lastRebalance: data.lastRebalance ?? null,
    }
    const pool = await prisma.pool.create({ data: poolData })
    return NextResponse.json(pool, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create pool" }, { status: 400 })
  }
}
