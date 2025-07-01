import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function getPoolById(poolId: string) {
  return prisma.pool.findUnique({
    where: { id: poolId },
    include: { transactions: true },
  });
} 