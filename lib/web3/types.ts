import { ethers } from "ethers";

export type Web3ContextType = {
  account: string | null;
  provider: ethers.JsonRpcProvider | null;
  signer: ethers.JsonRpcSigner | null;
  dETHContract: ethers.Contract | null;
  sETHContract: ethers.Contract | null;
  governanceContract: ethers.Contract | null;
  stakingDashboardContract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  chainId: number | null;
  refreshBalances: () => Promise<void>;
  networkName: string;
  ethBalance: string;
  dETHBalance: string;
  sETHBalance: string;
};

export type Contracts = {
  dETH: ethers.Contract;
  sETH: ethers.Contract;
  governance: ethers.Contract;
  stakingDashboard: ethers.Contract;
};

export type Balances = {
  eth: string;
  dETH: string;
  sETH: string;
};
