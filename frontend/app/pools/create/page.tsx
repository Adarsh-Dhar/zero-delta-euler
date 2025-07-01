import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MotionSection } from "@/components/motion-section"

export default function PoolCreatePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <MotionSection>
        <Card className="bg-background/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Pool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Step 1: Token Pair Selection */}
            <div>
              <div className="font-semibold mb-2">1. Select Token Pair</div>
              <div className="flex gap-4">
                <Input className="w-32" placeholder="Token 1" />
                <Input className="w-32" placeholder="Token 2" />
                <Button variant="outline">Import</Button>
              </div>
              <div className="text-xs text-warning mt-1">Token import warning</div>
            </div>
            {/* Step 2: Parameter Configuration */}
            <div>
              <div className="font-semibold mb-2">2. Configure Parameters</div>
              <div className="flex gap-4 mb-2">
                <Input className="w-32" placeholder="Initial Price" />
                <Input type="range" min="0" max="100" className="w-32" />
                <span>Concentration</span>
                <select className="select select-bordered">
                  <option>0.3%</option>
                  <option>1%</option>
                </select>
              </div>
            </div>
            {/* Step 3: Initial Deposit */}
            <div>
              <div className="font-semibold mb-2">3. Initial Deposit</div>
              <div className="flex gap-4 mb-2">
                <Input className="w-32" placeholder="Token 1 Amount" />
                <Input className="w-32" placeholder="Token 2 Amount" />
              </div>
              <div className="text-xs text-muted-foreground">Deposit ratio preview</div>
              <Button variant="secondary" className="mt-2">Approve Vault</Button>
            </div>
            {/* Step 4: Confirmation */}
            <div>
              <div className="font-semibold mb-2">4. Confirm & Deploy</div>
              <div className="text-xs text-muted-foreground mb-2">Parameter summary, estimated gas cost</div>
              <Button className="w-full">Deploy Pool</Button>
            </div>
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  )
} 