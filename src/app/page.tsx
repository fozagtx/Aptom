"use client";

import { AccountInfo } from "@/components/AccountInfo";
import { Header } from "@/components/Header";
import { MessageBoard } from "@/components/MessageBoard";
import { NetworkInfo } from "@/components/NetworkInfo";
import { TopBanner } from "@/components/TopBanner";
import { TransferAPT } from "@/components/TransferAPT";
import { WalletDetails } from "@/components/WalletDetails";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function App() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <TopBanner />
      <Header />
      <div className="flex items-center justify-center flex-col py-8 px-4">
        {connected ? (
          <Card className="w-full max-w-2xl shadow-lg">
            <CardContent className="flex flex-col gap-10 pt-6">
              <WalletDetails />
              <NetworkInfo />
              <AccountInfo />
              <TransferAPT />
              <MessageBoard />
            </CardContent>
          </Card>
        ) : (
          <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Aptos Boilerplate
              </CardTitle>
              <p className="text-gray-600 mb-6">
                To get started, please connect your wallet
              </p>
            </CardHeader>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
