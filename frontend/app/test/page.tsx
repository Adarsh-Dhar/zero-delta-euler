"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { formatUnits, parseUnits } from "viem"
import { DEFAULT_NEUTRAL_VAULT_ABI, ERC20_ABI, OPERATOR_ABI, REBALANCER_ABI } from "@/lib/contract/abi"
import { VAULT_ADDRESS, USDC_ADDRESS, USDC_DECIMALS, OPERATOR_ADDRESS, REBALANCER_ADDRESS } from "@/lib/contract/address"
import { toast } from "sonner"

export default function TestPage() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}`>()
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}`>()
  const [withdrawTxHash, setWithdrawTxHash] = useState<`0x${string}`>()
  const [rebalanceTxHash, setRebalanceTxHash] = useState<`0x${string}`>()

  const { data: vaultMetrics, refetch: refetchVaultMetrics } = useReadContract({
    abi: DEFAULT_NEUTRAL_VAULT_ABI,
    address: VAULT_ADDRESS,
    functionName: "getVaultMetrics",
  })

  const { data: healthMetrics, refetch: refetchHealthMetrics } = useReadContract({
    abi: OPERATOR_ABI,
    address: OPERATOR_ADDRESS,
    functionName: "getHealthMetrics",
  })

  const { data: rebalanceStatus, refetch: refetchRebalanceStatus } = useReadContract({
      abi: REBALANCER_ABI,
      address: REBALANCER_ADDRESS,
      functionName: "getRebalanceStatus",
  })

  const { data: userVaultBalance, refetch: refetchUserVaultBalance } = useReadContract({
    abi: DEFAULT_NEUTRAL_VAULT_ABI,
    address: VAULT_ADDRESS,
    functionName: "balanceOf",
    args: [address!],
    query: {
        enabled: !!address,
    }
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    address: USDC_ADDRESS,
    functionName: "allowance",
    args: [address!, VAULT_ADDRESS],
    account: address,
    query: {
        enabled: !!address,
    }
  })

  const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({
      hash: approveTxHash,
  })

  const { isLoading: isDepositing, isSuccess: isDeposited } = useWaitForTransactionReceipt({
      hash: depositTxHash,
  })

  const { isLoading: isWithdrawing, isSuccess: isWithdrawn } = useWaitForTransactionReceipt({
      hash: withdrawTxHash,
  })

  const { isLoading: isRebalancing, isSuccess: isRebalanced } = useWaitForTransactionReceipt({
      hash: rebalanceTxHash,
  })

  const handleApprove = async () => {
    if (!depositAmount) return
    try {
      const hash = await writeContractAsync({
        abi: ERC20_ABI,
        address: USDC_ADDRESS,
        functionName: "approve",
        args: [VAULT_ADDRESS, parseUnits(depositAmount, USDC_DECIMALS)],
      })
      setApproveTxHash(hash)
      toast.info("Approval transaction sent")
    } catch (error) {
      console.error("Approval failed", error)
      toast.error("Approval failed")
    }
  }

  const handleDeposit = async () => {
    if (!depositAmount) return
    try {
      const hash = await writeContractAsync({
        abi: DEFAULT_NEUTRAL_VAULT_ABI,
        address: VAULT_ADDRESS,
        functionName: "deposit",
        args: [parseUnits(depositAmount, USDC_DECIMALS)],
      })
      setDepositTxHash(hash)
      toast.info("Deposit transaction sent")
    } catch (error) {
      console.error("Deposit failed", error)
      toast.error("Deposit failed")
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) return
    try {
      const hash = await writeContractAsync({
        abi: DEFAULT_NEUTRAL_VAULT_ABI,
        address: VAULT_ADDRESS,
        functionName: "withdraw",
        args: [parseUnits(withdrawAmount, 18)], // Vault shares have 18 decimals
      })
      setWithdrawTxHash(hash)
      toast.info("Withdraw transaction sent")
    } catch (error) {
      console.error("Withdraw failed", error)
      toast.error("Withdraw failed")
    }
  }

  const handleRebalance = async () => {
    try {
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
    }
  }

  useEffect(() => {
    if (isApproved) {
        toast.success("Approval successful!")
        refetchAllowance()
        setApproveTxHash(undefined)
    }
  }, [isApproved, refetchAllowance])

  useEffect(() => {
    if (isDeposited) {
        toast.success("Deposit successful!")
        setDepositAmount("")
        refetchVaultMetrics()
        refetchAllowance()
        setDepositTxHash(undefined)
    }
  }, [isDeposited, refetchAllowance, refetchVaultMetrics])

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

  const metrics = vaultMetrics as [bigint, bigint, bigint, bigint, boolean, boolean] | undefined
  const health = healthMetrics as [bigint, bigint, bigint, bigint, bigint] | undefined
  const rebalance = rebalanceStatus as [boolean, bigint, bigint, bigint, bigint, bigint] | undefined

  const needsApproval =
    typeof allowance === 'bigint' &&
    depositAmount &&
    allowance < parseUnits(depositAmount, USDC_DECIMALS)

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Vault Test Page</h1>

      {address ? (
        <div>
          <p className="mb-4">Connected as: {address}</p>
          <p className="mb-4">Your vault shares: {userVaultBalance ? formatUnits(BigInt(userVaultBalance.toString()), 18) : "0"}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Vault Metrics</h2>
              {metrics ? (
                <div className="grid grid-cols-2 gap-2">
                  <p>Total Supply:</p><p>{metrics[0] ? formatUnits(metrics[0], 18) : "0"}</p>
                  <p>Total Assets (USDC):</p><p>{metrics[1] ? formatUnits(metrics[1], USDC_DECIMALS) : "0"}</p>
                  <p>Share Price:</p><p>{metrics[2] ? formatUnits(metrics[2], 18) : "0"}</p>
                  <p>Last Price:</p><p>{metrics[3] ? formatUnits(metrics[3], 18) : "0"}</p>
                  <p>Deposits Enabled:</p><p>{metrics[4] ? "Yes" : "No"}</p>
                  <p>Withdrawals Enabled:</p><p>{metrics[5] ? "Yes" : "No"}</p>
                </div>
              ) : (
                <p>Loading vault metrics...</p>
              )}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">Operator Health</h2>
                {health ? (
                    <div className="grid grid-cols-2 gap-2">
                        <p>Current LTV:</p><p>{health[0] ? formatUnits(health[0], 18) : "0"}</p>
                        <p>Collateral:</p><p>${health[1] ? formatUnits(health[1], 18) : "0"}</p>
                        <p>Debt:</p><p>${health[2] ? formatUnits(health[2], 18) : "0"}</p>
                        <p>Liquidity:</p><p>${health[3] ? formatUnits(health[3], 18) : "0"}</p>
                        <p>Delta:</p><p>${health[4]?.toString()}</p>
                    </div>
                ) : (
                    <p>Loading health metrics...</p>
                )}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">Rebalancer Status</h2>
                {rebalance ? (
                    <div className="grid grid-cols-2 gap-2">
                        <p>Should Rebalance:</p><p>{rebalance[0] ? "Yes" : "No"}</p>
                        <p>Current Price:</p><p>${rebalance[1] ? formatUnits(rebalance[1], 18) : "0"}</p>
                        <p>Last Price:</p><p>${rebalance[2] ? formatUnits(rebalance[2], 18) : "0"}</p>
                        <p>Deviation Bps:</p><p>{rebalance[3]?.toString()}</p>
                        <p>Last Rebalance:</p><p>{rebalance[4]?.toString()}s ago</p>
                        <p>Rebalance Count:</p><p>{rebalance[5]?.toString()}</p>
                    </div>
                ) : (
                    <p>Loading rebalance status...</p>
                )}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Actions</h2>
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-2">Deposit</h3>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="Enter USDC amount"
                            className="bg-gray-700 text-white p-2 rounded-md"
                        />
                        <div className="flex gap-4">
                            {needsApproval ? (
                            <button
                                onClick={handleApprove}
                                disabled={!depositAmount || isApproving}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {isApproving ? "Approving..." : "Approve USDC"}
                            </button>
                            ) : (
                            <button
                                onClick={handleDeposit}
                                disabled={!depositAmount || isDepositing}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {isDepositing ? "Depositing..." : "Deposit USDC"}
                            </button>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">Withdraw</h3>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter shares amount"
                            className="bg-gray-700 text-white p-2 rounded-md"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleWithdraw}
                                disabled={!withdrawAmount || isWithdrawing}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <h2 className="text-2xl font-semibold mb-2">Admin Actions</h2>
            <button
                onClick={handleRebalance}
                disabled={isRebalancing}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {isRebalancing ? "Rebalancing..." : "Rebalance"}
            </button>
          </div>
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  )
}
