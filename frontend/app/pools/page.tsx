"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { MotionSection } from "@/components/motion-section"

export default function PoolsPage() {
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPools() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/pools")
        if (!res.ok) throw new Error("Failed to fetch pools")
        const data = await res.json()
        setPools(data)
      } catch (err: any) {
        setError(err.message || "Error loading pools")
      } finally {
        setLoading(false)
      }
    }
    fetchPools()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <MotionSection className="mb-8">
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <Input className="w-64" placeholder="Search token pair..." />
          <select className="select select-bordered">
            <option>Sort: TVL</option>
            <option>Volume</option>
            <option>APR</option>
          </select>
          <select className="select select-bordered">
            <option>Fee: All</option>
            <option>0.3%</option>
            <option>1%</option>
          </select>
          <Button asChild className="ml-auto">
            <Link href="/pools/create">Create Pool</Link>
          </Button>
        </div>
        <Card className="bg-background/50 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead>TVL</TableHead>
                  <TableHead>Volume (24h)</TableHead>
                  <TableHead>APR</TableHead>
                  <TableHead>Concentration</TableHead>
                  <TableHead>Fees Collected</TableHead>
                  <TableHead>Reserve Ratios</TableHead>
                  <TableHead>LTV Ratio</TableHead>
                  <TableHead>Last Rebalance</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading pools...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-destructive">{error}</TableCell>
                  </TableRow>
                ) : pools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pools found.</TableCell>
                  </TableRow>
                ) : (
                  pools.map((pool) => (
                    <TableRow key={pool.id} className="hover:bg-muted/50">
                      <TableCell className="flex items-center gap-2">
                        <span className="bg-muted rounded-full w-6 h-6" />
                        {pool.token0}/{pool.token1}
                      </TableCell>
                      <TableCell>{pool.tvl ? `$${Number(pool.tvl).toLocaleString()}` : "-"}</TableCell>
                      <TableCell>{pool.volume24h ? `$${Number(pool.volume24h).toLocaleString()}` : "-"}</TableCell>
                      <TableCell>{pool.apr ? `${Number(pool.apr).toFixed(2)}%` : "-"}</TableCell>
                      <TableCell>
                        <span className="bg-primary/10 rounded px-2 py-1 text-xs">{pool.concentration || "-"}</span>
                      </TableCell>
                      <TableCell>{pool.feesCollected ? `$${Number(pool.feesCollected).toLocaleString()}` : "-"}</TableCell>
                      <TableCell>{pool.reserveRatios ? pool.reserveRatios : "-"}</TableCell>
                      <TableCell>{pool.ltvRatio ? `${Number(pool.ltvRatio).toFixed(2)}%` : "-"}</TableCell>
                      <TableCell>{pool.lastRebalance ? pool.lastRebalance : "-"}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button asChild variant="secondary" size="sm"><Link href={`/pools/${pool.id}`}>View</Link></Button>
                        <Button variant="outline" size="sm">Add Liquidity</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  )
} 