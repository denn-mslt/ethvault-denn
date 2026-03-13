"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import {
  HOLESKY_CHAIN_ID,
  HOLESKY_RPC_URL,
  HOLESKY_NETWORK_PARAMS,
  STAKING_DASHBOARD_ADDRESS,
  warnMissingEnv,
} from "@/lib/web3/config";
import { initContracts, verifyContract } from "@/lib/web3/contracts";
import { fetchBalances } from "@/lib/web3/balances";
import type { Web3ContextType } from "@/lib/web3/types";

// Warn on missing env vars (client-side only)
warnMissingEnv();

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  signer: null,
  dETHContract: null,
  sETHContract: null,
  governanceContract: null,
  stakingDashboardContract: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
  chainId: null,
  refreshBalances: async () => {},
  networkName: "",
  ethBalance: "0",
  dETHBalance: "0",
  sETHBalance: "0",
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [dETHContract, setDETHContract] = useState<ethers.Contract | null>(
    null,
  );
  const [sETHContract, setSETHContract] = useState<ethers.Contract | null>(
    null,
  );
  const [governanceContract, setGovernanceContract] =
    useState<ethers.Contract | null>(null);
  const [stakingDashboardContract, setStakingDashboardContract] =
    useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState("");
  const [hasShownConnectToast, setHasShownConnectToast] = useState(false);
  const [ethBalance, setEthBalance] = useState("0");
  const [dETHBalance, setDETHBalance] = useState("0");
  const [sETHBalance, setSETHBalance] = useState("0");

  const { toast } = useToast();

  // --- Balances ---

  const updateBalances = async (
    rpcProvider: ethers.JsonRpcProvider,
    address: string,
  ) => {
    const balances = await fetchBalances(rpcProvider, address);
    setEthBalance(balances.eth);
    setDETHBalance(balances.dETH);
    setSETHBalance(balances.sETH);
  };

  const refreshBalances = async () => {
    if (!account || !provider) return;
    await updateBalances(provider, account);
  };

  // --- Network ---

  const ensureCorrectNetwork = async () => {
    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });
    const currentChainId = Number.parseInt(chainIdHex, 16);

    if (currentChainId === HOLESKY_CHAIN_ID) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${HOLESKY_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: unknown) {
      if (
        switchError instanceof Error &&
        (switchError as Error & { code?: number }).code === 4902
      ) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [HOLESKY_NETWORK_PARAMS],
        });
      } else {
        throw switchError;
      }
    }
  };

  // --- Connect / Disconnect ---

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "Metamask Not Found",
        description: "Please install Metamask to use this application",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request accounts & switch network
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];
      await ensureCorrectNetwork();

      // Create providers
      const rpcProvider = new ethers.JsonRpcProvider(HOLESKY_RPC_URL);
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await browserProvider.getSigner();
      const network = await rpcProvider.getNetwork();

      // Verify contracts exist on-chain
      const stakingExists = await verifyContract(
        rpcProvider,
        STAKING_DASHBOARD_ADDRESS,
      );
      if (!stakingExists) {
        toast({
          title: "Contract Not Found",
          description:
            "StakingDashboard contract not found. Verify the address and network.",
          variant: "destructive",
        });
        return;
      }

      // Initialize contracts
      const contracts = initContracts(web3Signer);

      // Update state
      setAccount(userAddress);
      setProvider(rpcProvider);
      setSigner(web3Signer);
      setIsConnected(true);
      setChainId(Number(network.chainId));
      setNetworkName("Connected");
      setDETHContract(contracts.dETH);
      setSETHContract(contracts.sETH);
      setGovernanceContract(contracts.governance);
      setStakingDashboardContract(contracts.stakingDashboard);

      // Fetch balances
      await updateBalances(rpcProvider, userAddress);

      if (!hasShownConnectToast) {
        toast({
          title: "Wallet Connected",
          description: `Connected to ${userAddress.substring(0, 6)}...${userAddress.substring(38)}`,
        });
        setHasShownConnectToast(true);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
    setHasShownConnectToast(false);
    setEthBalance("0");
    setDETHBalance("0");
    setSETHBalance("0");

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  // --- Event Listeners ---

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        if (provider) await updateBalances(provider, accounts[0]);
      } else {
        setAccount(null);
        setIsConnected(false);
        setHasShownConnectToast(false);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = Number.parseInt(chainIdHex, 16);
      setChainId(newChainId);

      if (newChainId !== HOLESKY_CHAIN_ID) {
        toast({
          title: "Wrong Network",
          description: "Please switch to the correct network",
          variant: "destructive",
        });
        setIsConnected(false);
        setNetworkName("");
        setHasShownConnectToast(false);
      } else {
        setNetworkName("Connected");
        if (account && provider) updateBalances(provider, account);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account, provider]);

  // Auto-connect if previously connected
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        if (accounts.length > 0) connectWallet();
      })
      .catch(() => {});
  }, []);

  // Periodic balance refresh (every 15s)
  useEffect(() => {
    if (!isConnected || !account || !provider) return;

    const intervalId = setInterval(() => {
      updateBalances(provider, account);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [isConnected, account, provider]);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        dETHContract,
        sETHContract,
        governanceContract,
        stakingDashboardContract,
        connectWallet,
        disconnectWallet,
        isConnected,
        chainId,
        refreshBalances,
        networkName,
        ethBalance,
        dETHBalance,
        sETHBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
