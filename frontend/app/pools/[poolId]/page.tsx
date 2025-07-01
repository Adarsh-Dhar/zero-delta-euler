import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MotionSection } from "@/components/motion-section"
import { notFound } from "next/navigation"
import { getPoolById } from "@/lib/prisma/pools"

// Add a type for tx
interface Transaction {
  id: string;
  type: string;
  amount0: number;
  amount1: number;
  txHash: string;
  timestamp: string;
}

export default async function PoolDetailPage({ params }: { params: { poolId: string } }) {
  const pool = await getPoolById(params.poolId)
  if (!pool) return notFound()

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Pool Header */}
      <MotionSection className="mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-full w-12 h-12" />
          <div>
            <div className="text-2xl font-bold">{pool.token0}/{pool.token1}</div>
            <div className="flex gap-2 items-center mt-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">{pool.feeTier}% Fee</span>
              <span className="bg-background/50 px-2 py-1 rounded text-xs">{pool.owner}</span>
            </div>
          </div>
        </div>
      </MotionSection>
      {/* Statistics Cards */}
      <MotionSection delay={0.1} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-background/50 border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-muted-foreground text-xs mb-1">TVL</div>
              <div className="text-xl font-bold">${Number(pool.tvl).toLocaleString()}</div>
              <div className="h-16 bg-muted rounded mt-2" />
            </CardContent>
          </Card>
          <Card className="bg-background/50 border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-muted-foreground text-xs mb-1">Volume (24h)</div>
              <div className="text-xl font-bold">${Number(pool.volume24h).toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50 border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-muted-foreground text-xs mb-1">Fees Collected</div>
              <div className="text-xl font-bold">${Number(pool.feesCollected).toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50 border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-muted-foreground text-xs mb-1">Reserve Ratios</div>
              <div className="text-xl font-bold">{pool.reserveRatios}</div>
            </CardContent>
          </Card>
        </div>
      </MotionSection>
      {/* Liquidity Management */}
      <MotionSection delay={0.2} className="mb-8">
        <Card className="bg-background/50 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 font-semibold text-lg">Add Liquidity</div>
            <div className="flex gap-4 mb-4">
              <Input className="w-32" placeholder={`${pool.token0} Amount`} />
              <Input className="w-32" placeholder={`${pool.token1} Amount`} />
              <Button>Add</Button>
            </div>
            <div className="mb-4 font-semibold text-lg">Remove Liquidity</div>
            <div className="flex gap-4 items-center">
              <Input type="range" min="0" max="100" className="w-32" />
              <span>50%</span>
              <Button variant="secondary">Remove</Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Share: 2.5%</div>
          </CardContent>
        </Card>
      </MotionSection>
      {/* Rebalance Status */}
      <MotionSection delay={0.3} className="mb-8">
        <Card className="bg-muted/30 border-0">
          <CardContent className="p-4 flex justify-between items-center text-sm">
            <span>LTV Ratio: <span className="text-primary font-semibold">{pool.ltvRatio}%</span></span>
            <span>Last Rebalance: {pool.lastRebalance ? new Date(pool.lastRebalance).toLocaleString() : "-"}</span>
          </CardContent>
        </Card>
      </MotionSection>
      {/* Transaction History */}
      <MotionSection delay={0.4}>
        <Card className="bg-background/50 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {pool.transactions && pool.transactions.length > 0 ? pool.transactions.map((tx: Transaction) => (
                <li key={tx.id} className="py-2 flex justify-between items-center text-sm">
                  <span>{tx.type}</span>
                  <span>{tx.amount1} {pool.token1} → {tx.amount0} {pool.token0}</span>
                  <a href={`https://etherscan.io/tx/${tx.txHash}`} className="text-primary underline" target="_blank" rel="noopener noreferrer">{tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}</a>
                  <span className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</span>
                </li>
              )) : <li className="py-2 text-muted-foreground text-center">No transactions yet.</li>}
            </ul>
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  )
} 