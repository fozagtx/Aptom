import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useMemo } from "react";

/**
 * Senior Engineer Hook: Ensures wallet is fully ready for transactions
 * Prevents the race condition between connected state and account loading
 */
export function useWalletReady() {
  const { connected, account } = useWallet();

  const isWalletReady = useMemo(() => {
    return connected && !!account?.address;
  }, [connected, account?.address]);

  const walletStatus = useMemo(() => {
    if (!connected) return "disconnected";
    if (connected && !account?.address) return "loading";
    if (connected && account?.address) return "ready";
    return "unknown";
  }, [connected, account?.address]);

  return {
    isWalletReady,
    walletStatus,
    account,
    connected,
  };
}
