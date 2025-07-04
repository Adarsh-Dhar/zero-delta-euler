"use client"
import { useState, useEffect } from 'react';
import { useAccount, useChainId, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { readContract } from 'wagmi/actions';
import { config } from '../providers';
// TODO: Update these import paths as needed:
import { EVC_ADDRESS, EULER_DEPLOYMENTS } from '../../lib/contract/address';
import { EULER_VAULT_ABI } from '../../lib/contract/abi/Vault';
import { ERC20_ABI } from '../../lib/contract/abi/ERC20';
import { EVC_ABI } from '../../lib/contract/abi/EVC';

const PostDeploymentActions = () => {
  const { address: account } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<string>('idle');
  const [contracts, setContracts] = useState<any>({});
  const [usdcAmount, setUsdcAmount] = useState<string>('50000');

  // Discover contract addresses
  useEffect(() => {
    const discoverAddresses = async () => {
      if (!account || !chainId) return;
      try {
        // TODO: Replace with actual config import
        const configObj = EULER_DEPLOYMENTS?.[chainId];
        if (!configObj) throw new Error('Unsupported network');
        // Get DeltaHedger address from local storage (set after deployment)
        const deltaHedgerAddress = localStorage.getItem('deltaHedgerAddress') as `0x${string}`;
        if (!deltaHedgerAddress) throw new Error('Deploy DeltaHedger first');
        // Get EulerSwap address from DeltaHedger
        const eulerSwapAddress = await readContract(config, {
          address: deltaHedgerAddress,
          abi: [{
            name: 'eulerSwap',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ type: 'address' }],
          }],
          functionName: 'eulerSwap',
          args: [],
          account,
        }) as `0x${string}`;
        // Get vaults from EulerSwap
        const params = await readContract(config, {
          address: eulerSwapAddress,
          abi: [{
            name: 'getParams',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [
              { type: 'address' },
              { type: 'address' },
            ],
          }],
          functionName: 'getParams',
          args: [],
          account,
        });
        const [vault0, vault1] = params as [`0x${string}`, `0x${string}`];
        // Get token addresses from vaults
        const asset0 = await readContract(config, {
          address: vault0,
          abi: [
            {
              name: 'asset',
              type: 'function',
              stateMutability: 'view',
              inputs: [],
              outputs: [{ type: 'address' }],
            },
          ],
          functionName: 'asset',
          args: [],
          account,
        }) as `0x${string}`;
        const asset1 = await readContract(config, {
          address: vault1,
          abi: [
            {
              name: 'asset',
              type: 'function',
              stateMutability: 'view',
              inputs: [],
              outputs: [{ type: 'address' }],
            },
          ],
          functionName: 'asset',
          args: [],
          account,
        }) as `0x${string}`;
        setContracts({
          deltaHedger: deltaHedgerAddress,
          eulerSwap: eulerSwapAddress,
          vault0,
          vault1,
          asset0,
          asset1,
        });
      } catch (error) {
        console.error('Address discovery failed:', error);
        setStatus('error');
      }
    };
    discoverAddresses();
  }, [account, chainId]);

  const executeSteps = async () => {
    if (!account) return;
    setStatus('processing');
    try {
      // 1. Operator Authorization
      await writeContractAsync({
        address: EVC_ADDRESS,
        abi: EVC_ABI,
        functionName: 'setAccountOperator',
        args: [account, contracts.deltaHedger, true],
        account,
      });
      setStatus('operator-authorized');
      // 2. Vault Enablement
      await writeContractAsync({
        address: EVC_ADDRESS,
        abi: EVC_ABI,
        functionName: 'enableCollateral',
        args: [account, contracts.vault0],
        account,
      });
      await writeContractAsync({
        address: EVC_ADDRESS,
        abi: EVC_ABI,
        functionName: 'enableCollateral',
        args: [account, contracts.vault1],
        account,
      });
      setStatus('vaults-enabled');
      // 3. Capital Deposit
      const amount = parseUnits(usdcAmount, 6);
      // Approve
      await writeContractAsync({
        address: contracts.asset0,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contracts.vault0, amount],
        account,
      });
      setStatus('approved');
      // Deposit
      await writeContractAsync({
        address: contracts.vault0,
        abi: EULER_VAULT_ABI,
        functionName: 'deposit',
        args: [amount, account],
        account,
      });
      setStatus('deposited');
      // Initialize strategy
      await writeContractAsync({
        address: contracts.deltaHedger,
        abi: [
          {
            name: 'initializeStrategy',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [{ name: 'ethPrice', type: 'uint256' }],
            outputs: [],
          },
        ],
        functionName: 'initializeStrategy',
        args: [BigInt(3000 * 10 ** 6)], // $3000 in USDC decimals
        account,
      });
      setStatus('completed');
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Post-Deployment Setup</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          USDC Deposit Amount
        </label>
        <input
          type="number"
          value={usdcAmount}
          onChange={(e) => setUsdcAmount(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="50000"
        />
        <p className="text-sm text-gray-500 mt-1">Amount in USD (6 decimals)</p>
      </div>
      <div className="space-y-3 mb-6">
        <ContractInfo label="EVC Address" value={EVC_ADDRESS?.[chainId] || 'Loading...'} />
        <ContractInfo label="DeltaHedger" value={contracts.deltaHedger || 'Loading...'} />
        <ContractInfo label="EulerSwap" value={contracts.eulerSwap || 'Loading...'} />
        <ContractInfo label="Vault 0" value={contracts.vault0 || 'Loading...'} />
        <ContractInfo label="Vault 1" value={contracts.vault1 || 'Loading...'} />
        <ContractInfo label="Asset 0" value={contracts.asset0 || 'Loading...'} />
        <ContractInfo label="Asset 1" value={contracts.asset1 || 'Loading...'} />
      </div>
      <button
        onClick={executeSteps}
        disabled={status.startsWith('processing') || !contracts.deltaHedger}
        className={`w-full py-3 px-4 rounded-md font-medium ${
          status.startsWith('processing') || !contracts.deltaHedger
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {getButtonText(status)}
      </button>
      <StatusIndicator status={status} />
    </div>
  );
};

// Helper components
const ContractInfo = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-medium">{label}:</span>
    <span className="font-mono text-sm truncate max-w-[60%]">{value}</span>
  </div>
);

const StatusIndicator = ({ status }: { status: string }) => (
  <div className="mt-4 p-4 bg-gray-100 rounded-md">
    <p className="font-medium">Status: {STATUS_MESSAGES[status] || status}</p>
    {status === 'error' && (
      <p className="text-red-500 mt-2">
        Check console for details. Ensure you have sufficient funds and gas.
      </p>
    )}
  </div>
);

// Status helpers
const STATUS_MESSAGES: Record<string, string> = {
  idle: 'Ready to execute setup',
  processing: 'Processing transactions...',
  'operator-authorized': 'Operator authorized ✅',
  'vaults-enabled': 'Vaults enabled ✅',
  approved: 'USDC approved ✅',
  deposited: 'Capital deposited ✅',
  completed: 'Setup completed successfully! 🎉',
  error: 'Operation failed'
};

const getButtonText = (status: string) => {
  if (status === 'idle') return 'Execute Setup';
  if (status === 'processing') return 'Processing...';
  if (status === 'completed') return 'Setup Complete';
  if (status === 'error') return 'Try Again';
  return 'Continue Setup';
};

export default PostDeploymentActions;
