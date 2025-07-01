import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

// GET /api/pools/[id] - Get a single pool
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const pool = await prisma.pool.findUnique({ where: { id: params.id } })
    if (!pool) return NextResponse.json({ error: "Pool not found" }, { status: 404 })
    return NextResponse.json(pool)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pool" }, { status: 500 })
  }
}

// PUT /api/pools/[id] - Update a pool
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const pool = await prisma.pool.update({ where: { id: params.id }, data })
    return NextResponse.json(pool)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update pool" }, { status: 400 })
  }
}

// DELETE /api/pools/[id] - Delete a pool
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.pool.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete pool" }, { status: 400 })
  }
}
