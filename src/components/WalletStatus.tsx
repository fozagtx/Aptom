"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";

export function WalletStatus() {
  const { connected, account } = useWallet();

  // Debug logging for senior engineer analysis
  useEffect(() => {
    console.log("🔍 Wallet State Debug:", {
      connected,
      hasAccount: !!account,
      accountAddress: account?.address ? String(account.address) : null,
      timestamp: new Date().toISOString(),
    });
  }, [connected, account]);

  if (connected && !account?.address) {
    return (
      <div className="flex items-center space-x-2 text-sm text-blue-600">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span>Loading account...</span>
      </div>
    );
  }

  if (connected && account?.address) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Wallet ready</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <span>Wallet disconnected</span>
    </div>
  );
}
