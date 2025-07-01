import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeftRight } from "lucide-react"
import { MotionSection } from "@/components/motion-section"

export default function SwapPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <MotionSection className="mb-8">
        <Card className="bg-background/50 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-8">
            {/* Token Selectors */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Button variant="outline" className="w-full h-16 text-lg font-semibold">Select Token</Button>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Balance: 0.00 <Button variant="link" size="sm" className="p-0 h-auto ml-1">MAX</Button></span>
                  <span className="">ETH/OP</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Button variant="secondary" size="icon" className="rounded-full"><ArrowLeftRight className="h-5 w-5" /></Button>
              </div>
              <div className="flex-1">
                <Button variant="outline" className="w-full h-16 text-lg font-semibold">Select Token</Button>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Balance: 0.00</span>
                  <span className="">ETH/OP</span>
                </div>
              </div>
            </div>
            {/* Amount Input */}
            <div className="mb-6">
              <Input type="number" placeholder="Enter amount" className="h-12 text-lg" />
            </div>
            {/* Price Impact & Quote */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Price Impact:</span>
                <span className="text-warning font-semibold">0.12%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Real-time Rate:</span>
                <span>1.00 USDC = 0.0005 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Minimum Received:</span>
                <span>0.00049 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Fee:</span>
                <span>$0.12</span>
              </div>
            </div>
            {/* Slippage & Deadline */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm">Slippage:</span>
                <Input type="number" min={0.1} max={1} step={0.1} className="w-20 h-8 text-sm" value={0.5} readOnly />
                <span className="text-sm">%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Deadline:</span>
                <Input type="number" min={1} max={30} className="w-16 h-8 text-sm" value={5} readOnly />
                <span className="text-sm">min</span>
              </div>
            </div>
            {/* Swap Action Button */}
            <Button size="lg" className="w-full text-lg py-6 mt-2">Connect Wallet</Button>
          </CardContent>
        </Card>
      </MotionSection>
      {/* Advanced Info Panel */}
      <MotionSection delay={0.1}>
        <Card className="bg-muted/30 border-0 backdrop-blur mt-4">
          <CardContent className="p-6 text-sm text-muted-foreground">
            <div className="flex justify-between mb-1"><span>Route:</span> <span className="text-primary font-semibold">USDC → ETH</span></div>
            <div className="flex justify-between mb-1"><span>Price Impact:</span> <span className="text-warning font-semibold">0.12%</span></div>
            <div className="flex justify-between mb-1"><span>Minimum Received:</span> <span>0.00049 ETH</span></div>
            <div className="flex justify-between mb-1"><span>Network Fee:</span> <span>$0.12</span></div>
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  )
} 