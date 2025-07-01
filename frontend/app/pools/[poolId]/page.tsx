import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MotionSection } from "@/components/motion-section"

export default function PoolDetailPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Pool Header */}
      <MotionSection className="mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-full w-12 h-12" />
          <div>
            <div className="text-2xl font-bold">USDC/ETH</div>
            <div className="flex gap-2 items-center mt-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">0.3% Fee</span>
              <span className="bg-background/50 px-2 py-1 rounded text-xs">Owner</span>
            </div>
          </div>
        </div>
      </MotionSection>
      {/* Statistics Cards */}
      <MotionSection delay={0.1} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          {["TVL", "Volume (24h/7D)", "Fees Collected", "Reserve Ratios"].map((label, idx) => (
            <Card key={label} className="bg-background/50 border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-xs mb-1">{label}</div>
                <div className="text-xl font-bold">{["$1,200,000", "$120K / $800K", "$3,200", "60% / 40%"][idx]}</div>
                {idx === 0 && <div className="h-16 bg-muted rounded mt-2" />} {/* Chart placeholder */}
              </CardContent>
            </Card>
          ))}
        </div>
      </MotionSection>
      {/* Liquidity Management */}
      <MotionSection delay={0.2} className="mb-8">
        <Card className="bg-background/50 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 font-semibold text-lg">Add Liquidity</div>
            <div className="flex gap-4 mb-4">
              <Input className="w-32" placeholder="USDC Amount" />
              <Input className="w-32" placeholder="ETH Amount" />
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
            <span>LTV Ratio: <span className="text-primary font-semibold">65%</span></span>
            <span>Last Rebalance: 2h ago</span>
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
              {[1,2,3].map(i => (
                <li key={i} className="py-2 flex justify-between items-center text-sm">
                  <span>Swap</span>
                  <span>0.5 ETH → 1,000 USDC</span>
                  <a href="#" className="text-primary underline">0x123...abc</a>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  )
} 