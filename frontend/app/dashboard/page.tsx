"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSignTypedData } from "wagmi"
import { formatUnits, parseUnits, hexToSignature } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { DEFAULT_NEUTRAL_VAULT_ABI, ERC20_ABI, OPERATOR_ABI, REBALANCER_ABI } from "@/lib/contract/abi"
import { VAULT_ADDRESS, USDC_ADDRESS, USDC_DECIMALS, OPERATOR_ADDRESS, REBALANCER_ADDRESS } from "@/lib/contract/address"
import { sepolia } from "viem/chains"
import { createPublicClient, http } from "viem"

// Setup viem public client for transaction receipt polling
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const { signTypedDataAsync } = useSignTypedData()

  // Metrics
  const { data: vaultMetrics, refetch: refetchVaultMetrics, isLoading: isLoadingVault } = useReadContract({
    abi: DEFAULT_NEUTRAL_VAULT_ABI,
    address: VAULT_ADDRESS,
    functionName: "getVaultMetrics",
  })
  const { data: healthMetrics, refetch: refetchHealthMetrics, isLoading: isLoadingHealth } = useReadContract({
    abi: OPERATOR_ABI,
    address: OPERATOR_ADDRESS,
    functionName: "getHealthMetrics",
  })
  const { data: rebalanceStatus, refetch: refetchRebalanceStatus, isLoading: isLoadingRebalance } = useReadContract({
    abi: REBALANCER_ABI,
    address: REBALANCER_ADDRESS,
    functionName: "getRebalanceStatus",
  })
  const { data: userVaultBalance, refetch: refetchUserVaultBalance } = useReadContract({
    abi: DEFAULT_NEUTRAL_VAULT_ABI,
    address: VAULT_ADDRESS,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address },
  })
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    address: USDC_ADDRESS,
    functionName: "allowance",
    args: [address!, VAULT_ADDRESS],
    account: address,
    query: { enabled: !!address },
  })
  const { data: nonce, refetch: refetchNonce } = useReadContract({
    abi: ERC20_ABI,
    address: USDC_ADDRESS,
    functionName: "nonces",
    args: [address!],
    account: address,
    query: { enabled: !!address },
  })

  // Transaction state
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}`>()
  const [withdrawTxHash, setWithdrawTxHash] = useState<`0x${string}`>()
  const [rebalanceTxHash, setRebalanceTxHash] = useState<`0x${string}`>()
  const { isLoading: isDepositing, isSuccess: isDeposited } = useWaitForTransactionReceipt({ hash: depositTxHash })
  const { isLoading: isWithdrawing, isSuccess: isWithdrawn } = useWaitForTransactionReceipt({ hash: withdrawTxHash })
  const { isLoading: isRebalancing, isSuccess: isRebalanced } = useWaitForTransactionReceipt({ hash: rebalanceTxHash })

  // UI state
  const [isDepositOpen, setDepositOpen] = useState(false)
  const [isWithdrawOpen, setWithdrawOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [newVaultAddress, setNewVaultAddress] = useState("")
  const [newOwnerAddress, setNewOwnerAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Approve USDC for vault
  const handleApprove = async (amount: bigint) => {
    try {
      const hash = await writeContractAsync({
        abi: ERC20_ABI,
        address: USDC_ADDRESS,
        functionName: "approve",
        args: [VAULT_ADDRESS, amount],
      })
      return hash
    } catch (error) {
      console.error("Approval failed", error)
      toast.error("USDC approval failed")
      throw error
    }
  }

  // Deposit USDC to vault
  const handleDeposit = async (amount: bigint) => {
    try {
      const hash = await writeContractAsync({
        abi: DEFAULT_NEUTRAL_VAULT_ABI,
        address: VAULT_ADDRESS,
        functionName: "deposit",
        args: [amount],
      })
      return hash
    } catch (error) {
      console.error("Deposit failed", error)
      toast.error("Deposit failed")
      throw error
    }
  }

  // Combined approve and deposit flow
  const handleApproveAndDeposit = async () => {
    if (!depositAmount) return
    try {
      setIsProcessing(true)
      const amount = parseUnits(depositAmount, USDC_DECIMALS)
      console.log("amount", amount)
      // 1. Check if deposits are enabled
      const { data: metricsRaw } = await refetchVaultMetrics()
      console.log("metricsRaw", metricsRaw)
      const metrics = metricsRaw as [bigint, bigint, bigint, bigint, boolean, boolean] | undefined
      console.log("metrics", metrics)
      if (!metrics?.[4]) throw new Error("Deposits are disabled")
      // 2. Check current allowance
      const currentAllowance = typeof allowance === "bigint" ? allowance : 0n
      console.log("currentAllowance", currentAllowance)
      // 3. Approve if needed
      if (currentAllowance < amount) {
        toast.info("Approving USDC...")
        const approveHash = await handleApprove(amount)
        await publicClient.waitForTransactionReceipt({ hash: approveHash })
        await refetchAllowance()
        toast.success("USDC approved successfully")
      }
      // 4. Execute deposit
      toast.info("Depositing USDC...")
      const depositHash = await handleDeposit(amount)
      setDepositTxHash(depositHash)
      toast.info("Deposit transaction sent")
    } catch (error: any) {
      console.error("Deposit process failed", error)
      toast.error(`Deposit failed: ${error.shortMessage || error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Withdraw
  const handleWithdraw = async () => {
    if (!withdrawAmount) return
    try {
      setIsProcessing(true)
      const shares = parseUnits(withdrawAmount, 18)
      const hash = await writeContractAsync({
        abi: DEFAULT_NEUTRAL_VAULT_ABI,
        address: VAULT_ADDRESS,
        functionName: "withdraw",
        args: [shares],
      })
      setWithdrawTxHash(hash)
      toast.info("Withdraw transaction sent")
    } catch (error) {
      console.error("Withdraw failed", error)
      toast.error("Withdraw failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Rebalance
  const handleRebalance = async () => {
    try {
      setIsProcessing(true)
      const hash = await writeContractAsync({
        abi: OPERATOR_ABI,
        address: OPERATOR_ADDRESS,
        functionName: "rebalance",
      })
      setRebalanceTxHash(hash)
      toast.info("Rebalance transaction sent")
    } catch (error) {
      console.error("Rebalance failed", error)
      toast.error("Rebalance failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Set Vault
  const handleSetVault = async () => {
    try {
      setIsProcessing(true)
      const hash = await writeContractAsync({
        abi: OPERATOR_ABI,
        address: OPERATOR_ADDRESS,
        functionName: "setVault",
        args: [newVaultAddress],
      })
      toast.success("Set Vault successful!")
    } catch (error) {
      console.error("Set Vault failed", error)
      toast.error("Set Vault failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Transfer Ownership
  const handleTransferOwnership = async () => {
    try {
      setIsProcessing(true)
      const hash = await writeContractAsync({
        abi: OPERATOR_ABI,
        address: OPERATOR_ADDRESS,
        functionName: "transferOwnership",
        args: [newOwnerAddress],
      })
      toast.success("Transfer Ownership successful!")
    } catch (error) {
      console.error("Transfer Ownership failed", error)
      toast.error("Transfer Ownership failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Renounce Ownership
  const handleRenounceOwnership = async () => {
    try {
      setIsProcessing(true)
      const hash = await writeContractAsync({
        abi: OPERATOR_ABI,
        address: OPERATOR_ADDRESS,
        functionName: "renounceOwnership",
      })
      toast.success("Renounce Ownership successful!")
    } catch (error) {
      console.error("Renounce Ownership failed", error)
      toast.error("Renounce Ownership failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Effects for transaction feedback
  useEffect(() => {
    if (isDeposited) {
      toast.success("Deposit successful!")
      setDepositAmount("")
      refetchVaultMetrics()
      refetchAllowance()
      refetchNonce()
      setDepositTxHash(undefined)
    }
  }, [isDeposited, refetchAllowance, refetchVaultMetrics, refetchNonce])

  useEffect(() => {
    if (isWithdrawn) {
      toast.success("Withdraw successful!")
      setWithdrawAmount("")
      refetchVaultMetrics()
      refetchUserVaultBalance()
      setWithdrawTxHash(undefined)
    }
  }, [isWithdrawn, refetchUserVaultBalance, refetchVaultMetrics])

  useEffect(() => {
    if (isRebalanced) {
      toast.success("Rebalance successful!")
      refetchHealthMetrics()
      refetchRebalanceStatus()
      refetchVaultMetrics()
      setRebalanceTxHash(undefined)
    }
  }, [isRebalanced, refetchHealthMetrics, refetchRebalanceStatus, refetchVaultMetrics])

  // Metrics formatting
  const metrics = vaultMetrics as [bigint, bigint, bigint, bigint, boolean, boolean] | undefined
  const health = healthMetrics as [bigint, bigint, bigint, bigint, bigint] | undefined
  const rebalance = rebalanceStatus as [boolean, bigint, bigint, bigint, bigint, bigint] | undefined

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Integration Dashboard</h1>
        <p className="text-muted-foreground">
          A centralized hub for testing all frontend and smart contract integrations.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vault Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button onClick={() => setDepositOpen(true)} disabled={!isConnected || isProcessing}>
                Deposit
              </Button>
              <Button onClick={() => setWithdrawOpen(true)} variant="outline" disabled={!isConnected || isProcessing}>
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
                onClick={() => {
                  refetchVaultMetrics()
                  refetchHealthMetrics()
                  refetchRebalanceStatus()
                }}
                size="sm"
                variant="outline"
                disabled={isLoadingVault || isLoadingHealth || isLoadingRebalance}
              >
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingVault || isLoadingHealth || isLoadingRebalance ? <p>Loading metrics...</p> : null}
              {metrics && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>Total Supply:</strong> {formatUnits(metrics[0], 18)}</p>
                  <p><strong>Total Assets:</strong> {formatUnits(metrics[1], USDC_DECIMALS)}</p>
                  <p><strong>Share Price:</strong> {formatUnits(metrics[2], 18)}</p>
                  <p><strong>Last Price:</strong> {formatUnits(metrics[3], 18)}</p>
                  <p><strong>Deposits Enabled:</strong> {metrics[4] ? "Yes" : "No"}</p>
                  <p><strong>Withdrawals Enabled:</strong> {metrics[5] ? "Yes" : "No"}</p>
                </div>
              )}
              {health && (
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <p><strong>Current LTV:</strong> {formatUnits(health[0], 18)}</p>
                  <p><strong>Collateral:</strong> ${formatUnits(health[1], 18)}</p>
                  <p><strong>Debt:</strong> ${formatUnits(health[2], 18)}</p>
                  <p><strong>Liquidity:</strong> ${formatUnits(health[3], 18)}</p>
                  <p><strong>Delta:</strong> ${health[4]?.toString()}</p>
                </div>
              )}
              {rebalance && (
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <p><strong>Should Rebalance:</strong> {rebalance[0] ? "Yes" : "No"}</p>
                  <p><strong>Current Price:</strong> ${formatUnits(rebalance[1], 18)}</p>
                  <p><strong>Last Price:</strong> ${formatUnits(rebalance[2], 18)}</p>
                  <p><strong>Deviation Bps:</strong> {rebalance[3]?.toString()}</p>
                  <p><strong>Last Rebalance:</strong> {rebalance[4]?.toString()}s ago</p>
                  <p><strong>Rebalance Count:</strong> {rebalance[5]?.toString()}</p>
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
                <Button onClick={handleRebalance} className="w-full" disabled={!isConnected || isProcessing}>
                  {isRebalancing ? "Rebalancing..." : "Rebalance"}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaultAddress">Set Vault Address</Label>
                <div className="flex gap-2">
                  <Input id="vaultAddress" placeholder="0x..." value={newVaultAddress} onChange={e => setNewVaultAddress(e.target.value)} />
                  <Button onClick={handleSetVault} disabled={!isConnected || isProcessing || !newVaultAddress}>
                    Set
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ownership</Label>
                <div className="flex gap-2">
                  <Input id="ownerAddress" placeholder="0x..." value={newOwnerAddress} onChange={e => setNewOwnerAddress(e.target.value)} />
                  <Button onClick={handleTransferOwnership} disabled={!isConnected || isProcessing || !newOwnerAddress}>
                    Transfer
                  </Button>
                </div>
                <Button onClick={handleRenounceOwnership} variant="destructive" className="w-full" disabled={!isConnected || isProcessing}>
                  Renounce Ownership
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Deposit Modal */}
      <div>
        {isDepositOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Deposit USDC</h2>
              <Input
                type="number"
                placeholder="Amount"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleApproveAndDeposit} 
                  disabled={isProcessing || !depositAmount}
                >
                  {isProcessing ? "Processing..." : "Deposit"}
                </Button>
                <Button variant="outline" onClick={() => setDepositOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Withdraw Modal */}
      <div>
        {isWithdrawOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Withdraw Shares</h2>
              <Input
                type="number"
                placeholder="Shares"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={handleWithdraw} disabled={isProcessing || !withdrawAmount}>
                  {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                </Button>
                <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
