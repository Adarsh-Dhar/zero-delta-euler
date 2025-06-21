"use client"

import * as React from "react"
import { useState } from "react"
import { ethers } from "ethers"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEthersSigner } from "@/hooks/useEthersSigner"
import { useMetrics } from "@/hooks/use-metrics"
import { DepositModal } from "@/components/deposit-modal"
import { WithdrawModal } from "@/components/withdraw-modal"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { REBALANCER_ABI, OPERATOR_ABI } from "@/lib/contract/abi"
import { REBALANCER_ADDRESS, OPERATOR_ADDRESS } from "@/lib/contract/address"

export default function DashboardPage() {
  const { isConnected } = useAccount()
  const signer = useEthersSigner()
  const { data: metrics, isLoading, error, refresh } = useMetrics()
  const [isDepositOpen, setDepositOpen] = useState(false)
  const [isWithdrawOpen, setWithdrawOpen] = useState(false)
  const [newVaultAddress, setNewVaultAddress] = useState("")
  const [newOwnerAddress, setNewOwnerAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const rebalancerContract = signer
    ? new ethers.Contract(REBALANCER_ADDRESS, REBALANCER_ABI, signer)
    : null
  const operatorContract = signer
    ? new ethers.Contract(OPERATOR_ADDRESS, OPERATOR_ABI, signer)
    : null

  const handleAction = async (
    action: () => Promise<any>,
    actionName: string
  ) => {
    if (!signer) {
      toast.error("Please connect your wallet first.")
      return
    }

    setIsProcessing(true)
    const toastId = toast.loading(`Processing ${actionName}...`)
    try {
      const tx = await action()
      await tx.wait()
      toast.success(`${actionName} successful!`, { id: toastId })
      refresh()
    } catch (err: any) {
      console.error(`${actionName} failed`, err)
      toast.error(err.reason || `${actionName} failed. Check console.`, {
        id: toastId,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRebalance = () =>
    handleAction(() => rebalancerContract!.rebalance(), "Rebalance")
  const handleSetVault = () =>
    handleAction(
      () => operatorContract!.setVault(newVaultAddress),
      "Set Vault"
    )
  const handleRenounceOwnership = () =>
    handleAction(
      () => operatorContract!.renounceOwnership(),
      "Renounce Ownership"
    )
  const handleTransferOwnership = () =>
    handleAction(
      () => operatorContract!.transferOwnership(newOwnerAddress),
      "Transfer Ownership"
    )

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Integration Dashboard</h1>
        <p className="text-muted-foreground">
          A centralized hub for testing all frontend and smart contract
          integrations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vault Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button
                onClick={() => setDepositOpen(true)}
                disabled={!isConnected || isProcessing}
              >
                Deposit
              </Button>
              <Button
                onClick={() => setWithdrawOpen(true)}
                variant="outline"
                disabled={!isConnected || isProcessing}
              >
                Withdraw
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Live Metrics</CardTitle>
              <Button
                onClick={refresh}
                size="sm"
                variant="outline"
                disabled={isLoading}
              >
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500">{error}</p>}
              {isLoading && <p>Loading metrics...</p>}
              {metrics && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong>Total Supply:</strong>{" "}
                    {formatCurrency(metrics.totalSupply)}
                  </p>
                  <p>
                    <strong>Total Assets:</strong>{" "}
                    {formatCurrency(metrics.totalAssets)}
                  </p>
                  <p>
                    <strong>ETH Borrowed:</strong>{" "}
                    {formatNumber(metrics.ethBorrowed, 6)}
                  </p>
                  <p>
                    <strong>Collateral:</strong>{" "}
                    {formatCurrency(metrics.collateral)}
                  </p>
                  <p>
                    <strong>Debt:</strong> {formatCurrency(metrics.debt)}
                  </p>
                  <p>
                    <strong>Rebalance Price:</strong>{" "}
                    {formatCurrency(metrics.lastRebalancePrice)}
                  </p>
                  <p>
                    <strong>Rebalance Count:</strong> {metrics.rebalanceCount}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract Interactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Operator Actions</Label>
                <Button
                  onClick={handleRebalance}
                  className="w-full"
                  disabled={!isConnected || isProcessing}
                >
                  Rebalance
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaultAddress">Set Vault Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="vaultAddress"
                    placeholder="0x..."
                    value={newVaultAddress}
                    onChange={(e) => setNewVaultAddress(e.target.value)}
                  />
                  <Button
                    onClick={handleSetVault}
                    disabled={!isConnected || isProcessing || !newVaultAddress}
                  >
                    Set
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ownership</Label>
                <div className="flex gap-2">
                  <Input
                    id="ownerAddress"
                    placeholder="0x..."
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                  />
                  <Button
                    onClick={handleTransferOwnership}
                    disabled={!isConnected || isProcessing || !newOwnerAddress}
                  >
                    Transfer
                  </Button>
                </div>
                <Button
                  onClick={handleRenounceOwnership}
                  variant="destructive"
                  className="w-full"
                  disabled={!isConnected || isProcessing}
                >
                  Renounce Ownership
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setDepositOpen(false)}
        onSuccess={() => {
          setDepositOpen(false)
          refresh()
        }}
      />
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSuccess={() => {
          setWithdrawOpen(false)
          refresh()
        }}
      />
    </div>
  )
}
