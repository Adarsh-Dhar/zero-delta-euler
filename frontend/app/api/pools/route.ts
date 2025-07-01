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
    const pool = await prisma.pool.create({ data })
    return NextResponse.json(pool, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create pool" }, { status: 400 })
  }
}
