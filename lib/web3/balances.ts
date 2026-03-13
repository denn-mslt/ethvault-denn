import { ethers } from "ethers";
import { DETH_ADDRESS, SETH_ADDRESS, ABIS } from "./config";
import type { Balances } from "./types";

/**
 * Fetch ETH, dETH, and sETH balances for a given address.
 * Uses a read-only provider (no signer needed).
 */
export async function fetchBalances(
  provider: ethers.JsonRpcProvider,
  address: string,
): Promise<Balances> {
  const zero = BigInt(0);
  const [ethBal, dETHBal, sETHBal] = await Promise.all([
    provider.getBalance(address).catch(() => zero),
    new ethers.Contract(DETH_ADDRESS, ABIS.dETH, provider)
      .balanceOf(address)
      .catch(() => zero),
    new ethers.Contract(SETH_ADDRESS, ABIS.sETH, provider)
      .balanceOf(address)
      .catch(() => zero),
  ]);

  return {
    eth: ethers.formatEther(ethBal),
    dETH: ethers.formatEther(dETHBal),
    sETH: ethers.formatEther(sETHBal),
  };
}
