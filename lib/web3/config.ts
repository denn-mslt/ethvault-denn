import dETHAbi from "@/lib/abis/dETH.json";
import sETHAbi from "@/lib/abis/sETH.json";
import governanceAbi from "@/lib/abis/governance.json";
import stakingDashboardAbi from "@/lib/abis/stakingDashboard.json";

// Contract addresses (can be overridden via env for different deployments)
export const DETH_ADDRESS =
  process.env.NEXT_PUBLIC_DETH_ADDRESS ||
  "0x520d7dAB4A5bCE6ceA323470dbffCea14b78253a";

export const SETH_ADDRESS =
  process.env.NEXT_PUBLIC_SETH_ADDRESS ||
  "0x16b0cD88e546a90DbE380A63EbfcB487A9A05D8e";

export const GOVERNANCE_ADDRESS =
  process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS ||
  "0xD396FE92075716598FAC875D12E708622339FA3e";

export const STAKING_DASHBOARD_ADDRESS =
  process.env.NEXT_PUBLIC_STAKING_DASHBOARD_ADDRESS ||
  "0xd33e9676463597AfFF5bB829796836631F4e2f1f";

// Holesky testnet configuration
export const HOLESKY_CHAIN_ID =
  Number(process.env.NEXT_PUBLIC_HOLESKY_CHAIN_ID) || 17000;

export const HOLESKY_RPC_URL =
  process.env.NEXT_PUBLIC_HOLESKY_RPC_URL || "https://holesky.drpc.org";

export const HOLESKY_BLOCK_EXPLORER = "https://holesky.etherscan.io";

// Contract ABIs (re-exported for convenience)
export const ABIS = {
  dETH: dETHAbi,
  sETH: sETHAbi,
  governance: governanceAbi,
  stakingDashboard: stakingDashboardAbi,
} as const;

// Network configuration for wallet_addEthereumChain
export const HOLESKY_NETWORK_PARAMS = {
  chainId: `0x${HOLESKY_CHAIN_ID.toString(16)}`,
  chainName: "Ethereum Testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: [HOLESKY_RPC_URL],
  blockExplorerUrls: [HOLESKY_BLOCK_EXPLORER],
} as const;

// Warn when fallback values are used
export function warnMissingEnv() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_HOLESKY_RPC_URL)
    console.warn(
      "Using fallback HOLESKY_RPC_URL; set NEXT_PUBLIC_HOLESKY_RPC_URL in .env.local for stability.",
    );
  if (!process.env.NEXT_PUBLIC_STAKING_DASHBOARD_ADDRESS)
    console.warn(
      "Using fallback STAKING_DASHBOARD_ADDRESS; set NEXT_PUBLIC_STAKING_DASHBOARD_ADDRESS in .env.local if different.",
    );
}
