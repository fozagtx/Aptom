import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { WalletStatus } from "@/components/WalletStatus";

export function MarketplaceHeader() {
  const { account, disconnect } = useWallet();

  return (
    <div className="flex justify-between items-center py-6 px-8 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Aptom Marketplace
            </h1>
            <p className="text-sm text-gray-500">Digital products on Aptos</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <WalletStatus />
          {account?.address && (
            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
              {String(account.address).slice(0, 6)}...
              {String(account.address).slice(-4)}
            </span>
          )}
        </div>
      </div>

      {account?.address && (
        <Button
          variant="outline"
          className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      )}
    </div>
  );
}
