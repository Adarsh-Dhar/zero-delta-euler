"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MotionSection } from "@/components/motion-section"
import { useState } from "react"
import { deployPool } from "@/lib/contract/interaction"
import { useAccount } from "wagmi"
import { Address } from "viem"

export default function PoolCreatePage() {
  const { address, isConnected } = useAccount()
  const [token0, setToken0] = useState("0x078D782b760474a361dDA0AF3839290b0EF57AD6")
  const [token1, setToken1] = useState("0x4200000000000000000000000000000000000006")
  const [concentration, setConcentration] = useState("0.3%")
  const [feeTier, setFeeTier] = useState(0.3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Utility to check if a string is a valid 0x-prefixed 20-byte hex address
  function isValidAddress(addr: string | undefined): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(addr || "")
  }

  const handleDeploy = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    if (!isConnected || !address) {
      setError("Please connect your wallet to deploy a pool.")
      setLoading(false)
      return
    }
    if (!isValidAddress(token0) || !isValidAddress(token1)) {
      setError("Please enter valid Ethereum addresses for both Token 0 and Token 1.")
      setLoading(false)
      return
    }
    // Construct params object matching IEulerSwap.Params
    const params = {
      vault0: token0, // For demo, use token0 address (should be vault address in real use)
      vault1: token1, // For demo, use token1 address (should be vault address in real use)
      eulerAccount: address,
      equilibriumReserve0: 0,
      equilibriumReserve1: 0,
      priceX: 1,
      priceY: 1,
      concentrationX: 1,
      concentrationY: 1,
      fee: 0,
      protocolFee: 0,
      protocolFeeRecipient: address,
    }
    const initialState = {
      currReserve0: 0,
      currReserve1: 0,
    }
    try {
      const salt = "0x0000000000000000000000000000000000000000000000000000000000000000"
      console.log("params", params)
      // Deploy onchain first
      const deployResult = await deployPool(params, initialState, salt, address as Address)
      console.log("deployResult", deployResult)
      // Only after confirmation, add to DB
      if (!token0 || !token1 || !address || feeTier === undefined || concentration === undefined) {
        setError("All fields are required for database entry.")
        setLoading(false)
        return
      }
      const apiPayload = {
        token0: String(token0),
        token1: String(token1),
        feeTier: Number(feeTier),
        concentration: String(concentration),
        owner: String(address),
      }
      const res = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add pool to DB")
      setSuccess("Pool deployed and added to database!")
      console.log("Pool creation response:", data)
    } catch (err: any) {
      setError(err.message || "Failed to create pool")
      console.error("Failed to create pool", err)
    } finally {
      setLoading(false)
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
              <Input className="w-full" placeholder="Owner Address" value={address || ""} disabled />
              <div className="text-xs text-muted-foreground">This should be your wallet address.</div>
              {!isConnected && <div className="text-xs text-warning mt-1">Please connect your wallet to deploy a pool.</div>}
            </div>
            {/* Step 4: Confirmation */}
            <div>
              <div className="font-semibold mb-2">4. Confirm & Deploy</div>
              <div className="text-xs text-muted-foreground mb-2">Parameter summary, estimated gas cost</div>
              <Button className="w-full" onClick={handleDeploy} disabled={loading}>
                {loading ? "Deploying..." : "Deploy Pool"}
              </Button>
              {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
              {success && <div className="text-xs text-green-600 mt-2">{success}</div>}
            </div>
          </CardContent>
        </Card>
      </MotionSection>
    </div>
  )
} 