import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

// GET /api/pools - List all pools
export async function GET() {
  try {
    const pools = await prisma.pool.findMany({ orderBy: { createdAt: "desc" } })
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
    // Map fields to correct types
    const poolData = {
      token0: data.token0,
      token1: data.token1,
      feeTier: parseFloat(data.feeTier),
      concentration: data.concentration,
      owner: data.owner,
      // tvl, volume24h, apr will use defaults
    }
    const pool = await prisma.pool.create({ data: poolData })
    return NextResponse.json(pool, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create pool" }, { status: 400 })
  }
}
