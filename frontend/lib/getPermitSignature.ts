import { ethers, type Signer } from "ethers"
import { ERC20_ABI } from "./contract/abi/erc20"

export async function getPermitSignature(
  signer: Signer,
  owner: string,
  tokenAddress: string,
  spenderAddress: string,
  value: string,
  deadline?: number
) {
  // Add optional functions to the ABI
  const permitAbi = [
    ...ERC20_ABI,
    "function version() external view returns (string)",
    "function nonces(address owner) external view returns (uint256)",
    "function name() external view returns (string)",
  ]
  const tokenContract = new ethers.Contract(tokenAddress, permitAbi, signer)

  let version
  try {
    version = await tokenContract.version()
  } catch (e) {
    // Fallback to "1" if version() is not available
    version = "1"
  }

  const [nonce, name, chainId] = await Promise.all([
    tokenContract.nonces(owner),
    tokenContract.name(),
    signer.provider?.getNetwork().then((n) => n.chainId),
  ])

  const domain = {
    name,
    version,
    chainId,
    verifyingContract: tokenAddress,
  }

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  }

  const permitDeadline = deadline || Math.floor(Date.now() / 1000) + 3600

  const message = {
    owner,
    spender: spenderAddress,
    value,
    nonce,
    deadline: permitDeadline,
  }

  try {
    const signature = await signer.signTypedData(domain, types, message)
    const { v, r, s } = ethers.Signature.from(signature)

    return {
      v,
      r,
      s,
      deadline: permitDeadline,
    }
  } catch (e) {
    console.error("Signature request failed", e)
    return null
  }
} 