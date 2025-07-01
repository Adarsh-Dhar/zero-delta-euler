"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MotionSection } from "@/components/motion-section"
import { useState } from "react"

export default function PoolCreatePage() {
  const [token0, setToken0] = useState("")
  const [token1, setToken1] = useState("")
  const [concentration, setConcentration] = useState("0.3%")
  const [feeTier, setFeeTier] = useState(0.3)
  const [owner, setOwner] = useState("0x0000000000000000000000000000000000000000") // TODO: Replace with wallet address

  const handleDeploy = async () => {
    const payload = {
      token0,
      token1,
      feeTier,
      concentration,
      owner,
    }
    try {
      console.log("payload", payload)
      const res = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      console.log("Pool creation response:", data)
    } catch (err) {
      console.error("Failed to create pool", err)
    }
  }

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
                <Input className="w-32" placeholder="Token 0" value={token0} onChange={e => setToken0(e.target.value)} />
                <Input className="w-32" placeholder="Token 1" value={token1} onChange={e => setToken1(e.target.value)} />
                <Button variant="outline">Import</Button>
              </div>
              <div className="text-xs text-warning mt-1">Token import warning</div>
            </div>
            {/* Step 2: Parameter Configuration */}
            <div>
              <div className="font-semibold mb-2">2. Configure Parameters</div>
              <div className="flex gap-4 mb-2">
                <span>Fee Tier</span>
                <select
                  className="select select-bordered"
                  value={feeTier}
                  onChange={e => setFeeTier(parseFloat(e.target.value))}
                >
                  <option value={0.3}>0.3%</option>
                  <option value={1}>1%</option>
                </select>
                <span>Concentration</span>
                <Input className="w-32" placeholder="Concentration" value={concentration} onChange={e => setConcentration(e.target.value)} />
              </div>
            </div>
            {/* Step 3: Owner (for demo) */}
            <div>
              <div className="font-semibold mb-2">3. Owner Address</div>
              <Input className="w-full" placeholder="Owner Address" value={owner} onChange={e => setOwner(e.target.value)} />
              <div className="text-xs text-muted-foreground">This should be your wallet address.</div>
            </div>
            {/* Step 4: Confirmation */}
            <div>
              <div className="font-semibold mb-2">4. Confirm & Deploy</div>
              <div className="text-xs text-muted-foreground mb-2">Parameter summary, estimated gas cost</div>
              <Button className="w-full" onClick={handleDeploy}>Deploy Pool</Button>
            </div>
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  )
} 