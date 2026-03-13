"use client";

import { useWeb3 } from "@/components/providers/web3-provider";
import { formatBalance } from "@/lib/utils";

export function Balance() {
  const { isConnected, ethBalance, dETHBalance, sETHBalance } = useWeb3();

  if (!isConnected)
    return <span className="text-sm text-gray-400">Wallet not connected</span>;

  return (
    <div className="flex flex-col gap-1.5">
      <BalanceRow label="ETH" value={ethBalance} />
      <BalanceRow label="dETH" value={dETHBalance} />
      <BalanceRow label="sETH" value={sETHBalance} />
    </div>
  );
}

function BalanceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between bg-lightblue-50 px-3 py-1.5 rounded-md text-sm">
      <span className="font-medium text-lightblue-800">{label}</span>
      <span className="font-mono text-lightblue-800">
        {formatBalance(value)}
      </span>
    </div>
  );
}
