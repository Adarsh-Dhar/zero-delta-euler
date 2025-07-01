-- AlterTable
ALTER TABLE "Pool" ADD COLUMN     "feesCollected" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "lastRebalance" TIMESTAMP(3),
ADD COLUMN     "ltvRatio" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reserveRatios" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount0" DOUBLE PRECISION NOT NULL,
    "amount1" DOUBLE PRECISION NOT NULL,
    "txHash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
