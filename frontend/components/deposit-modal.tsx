"use client"

import { useEffect, useState } from "react"
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
import { VAULT_ADDRESS, USDC_ADDRESS, USDC_DECIMALS } from "@/lib/contract/address"
import { DEFAULT_NEUTRAL_VAULT_ABI } from "@/lib/contract/abi/defaultNeutralVault"
import { ERC20_ABI } from "@/lib/contract/abi/erc20"
import { getPermitSignature } from "@/lib/getPermitSignature"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { address, isConnected } = useAccount()
  const signer = useEthersSigner()

  useEffect(() => {
    // ... existing code ...
  }, [isOpen])

  const handleDeposit = async () => {
    console.log("handleDeposit", isOpen)
    try {
      console.log("handleDeposit", isConnected, signer, address)
    if (!isConnected || !signer || !address) {
      toast.error("Please connect your wallet first.")
      return
    }

    if (!amount) return

    setIsProcessing(true)
    const toastId = toast.loading("Preparing deposit...")

    try {
      const usdcAmount = ethers.parseUnits(amount, USDC_DECIMALS)
      console.log("usdcAmount", usdcAmount)
      const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer)
      const vaultContract = new ethers.Contract(
        VAULT_ADDRESS,
        DEFAULT_NEUTRAL_VAULT_ABI,
        signer
      )

      toast.loading("Waiting for signature...", { id: toastId })
      const signature = await getPermitSignature(
        signer,
        address,
        USDC_ADDRESS,
        VAULT_ADDRESS,
        usdcAmount.toString()
      )

      if (!signature) {
        toast.error("Could not get signature", { id: toastId })
        setIsProcessing(false)
        return
      }

      toast.loading("Depositing with permit...", { id: toastId })
      const { v, r, s, deadline } = signature

      console.log("depositWithPermit", usdcAmount, deadline, v, r, s)
      const depositTx = await vaultContract.depositWithPermit(
        usdcAmount,
        deadline,
        v,
        r,
        s
      )
      await depositTx.wait()

      toast.success("Deposit successful!", { id: toastId })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Deposit failed", error)
      toast.error("Deposit failed. Please check the console.", { id: toastId })
    } finally {
      setIsProcessing(false)
    }
  } catch (error) {
    console.error("Deposit failed", error)
    toast.error("Deposit failed. Please check the console.", { id: "deposit-error" })
  } finally {
    setIsProcessing(false)
  }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit USDC</DialogTitle>
          <DialogDescription>
            Enter the amount of USDC you want to deposit into the vault.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              type="number"
              placeholder="e.g., 1000"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleDeposit}
            disabled={isProcessing || !amount}
          >
            {isProcessing ? "Depositing..." : "Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 