import { ethers } from "ethers";
import {
  DETH_ADDRESS,
  SETH_ADDRESS,
  GOVERNANCE_ADDRESS,
  STAKING_DASHBOARD_ADDRESS,
  ABIS,
} from "./config";
import type { Contracts } from "./types";

/**
 * Initialize all platform contracts with the given signer.
 */
export function initContracts(signer: ethers.Signer): Contracts {
  return {
    dETH: new ethers.Contract(DETH_ADDRESS, ABIS.dETH, signer),
    sETH: new ethers.Contract(SETH_ADDRESS, ABIS.sETH, signer),
    governance: new ethers.Contract(
      GOVERNANCE_ADDRESS,
      ABIS.governance,
      signer,
    ),
    stakingDashboard: new ethers.Contract(
      STAKING_DASHBOARD_ADDRESS,
      ABIS.stakingDashboard,
      signer,
    ),
  };
}

/**
 * Verify that a contract exists at the given address (has deployed bytecode).
 */
export async function verifyContract(
  provider: ethers.JsonRpcProvider,
  address: string,
): Promise<boolean> {
  const code = await provider.getCode(address);
  return !!code && code !== "0x";
}
