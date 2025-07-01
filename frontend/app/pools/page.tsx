import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { MotionSection } from "@/components/motion-section"

export default function PoolsPage() {
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1,2,3].map(i => (
                  <TableRow key={i} className="hover:bg-muted/50">
                    <TableCell className="flex items-center gap-2"><span className="bg-muted rounded-full w-6 h-6" /> USDC/ETH</TableCell>
                    <TableCell>$1.2M</TableCell>
                    <TableCell>$120K</TableCell>
                    <TableCell>0.45%</TableCell>
                    <TableCell><span className="bg-primary/10 rounded px-2 py-1 text-xs">High</span></TableCell>
                    <TableCell className="flex gap-2">
                      <Button asChild variant="secondary" size="sm"><Link href={`/pools/1`}>View</Link></Button>
                      <Button variant="outline" size="sm">Add Liquidity</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  )
} 