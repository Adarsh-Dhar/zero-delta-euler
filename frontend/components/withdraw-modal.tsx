"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEthersSigner } from "@/hooks/useEthersSigner"
import { VAULT_ADDRESS, USDC_DECIMALS } from "@/lib/contract/address"
import { DEFAULT_NEUTRAL_VAULT_ABI } from "@/lib/contract/abi/defaultNeutralVault"
import { formatNumber } from "@/lib/utils"
import { useMetrics } from "@/hooks/use-metrics"

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function WithdrawModal({ isOpen, onClose, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { address, isConnected } = useAccount()
  const signer = useEthersSigner()
  const { data: metrics, refresh: refreshMetrics } = useMetrics()
  const [shareBalance, setShareBalance] = useState("0")

  const vaultContract = signer
    ? new ethers.Contract(VAULT_ADDRESS, DEFAULT_NEUTRAL_VAULT_ABI, signer)
    : null

  useEffect(() => {
    const fetchBalance = async () => {
      if (vaultContract && address) {
        const balance = await vaultContract.balanceOf(address)
        setShareBalance(ethers.formatUnits(balance, USDC_DECIMALS))
      }
    }
    if (isOpen) {
      fetchBalance()
    }
  }, [isOpen, vaultContract, address])

  const handleWithdraw = async () => {
    if (!isConnected || !signer || !address) {
      toast.error("Please connect your wallet first.")
      return
    }

    if (!vaultContract || !amount) return

    setIsProcessing(true)
    const toastId = toast.loading("Preparing withdrawal...")

    try {
      const sharesAmount = ethers.parseUnits(amount, USDC_DECIMALS)
      
      toast.loading("Withdrawing...", { id: toastId })
      const withdrawTx = await vaultContract.withdraw(sharesAmount)
      await withdrawTx.wait()

      toast.success("Withdrawal successful!", { id: toastId })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Withdrawal failed", error)
      toast.error("Withdrawal failed. Please check the console.", { id: toastId })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Shares</DialogTitle>
          <DialogDescription>
            Enter the amount of shares you want to withdraw from the vault.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-sm text-muted-foreground">
              Your share balance: {formatNumber(parseFloat(shareBalance), 6)}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Shares
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              className="col-span-3"
              type="number"
              placeholder="e.g., 1000"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleWithdraw}
            disabled={isProcessing || !amount}
          >
            {isProcessing ? "Withdrawing..." : "Withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 