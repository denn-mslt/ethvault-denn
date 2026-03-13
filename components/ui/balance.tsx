"use client";

import { useWeb3 } from "@/components/web3-provider";

export function Balance() {
  const { isConnected, ethBalance, dETHBalance, sETHBalance } = useWeb3();

  if (!isConnected)
    return <span className="text-sm text-gray-400">Wallet not connected</span>;

  return (
    <div className="flex flex-col text-right text-sm">
      <span className="text-gray-400">
        ETH: {Number.parseFloat(ethBalance).toFixed(4)}
      </span>
      <span className="text-gray-400">
        dETH: {Number.parseFloat(dETHBalance).toFixed(4)}
      </span>
      <span className="text-gray-400">
        sETH: {Number.parseFloat(sETHBalance).toFixed(4)}
      </span>
    </div>
  );
}
