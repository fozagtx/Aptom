"use client";

import { Header } from "@/components/Header";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { DigitalMarketplace } from "@/components/marketplace/DigitalMarketplace";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

function App() {
  const { connected, account } = useWallet();

  // Show marketplace only when wallet is truly ready
  if (connected && account?.address) {
    return (
      <ErrorBoundary>
        <DigitalMarketplace />
      </ErrorBoundary>
    );
  }

  // Show loading state when connected but account not loaded yet
  if (connected && !account?.address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[url('/noice.png')] bg-black -left-850">
      <Header />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto">
          <div className="space-y-6 mb-12">
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 leading-tight tracking-tight">
              Aptom <br />{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                creatorLand
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
          </div>

          <div className="space-y-8 mb-16">
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              turn your skills into income on the aptos network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
