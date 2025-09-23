import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/marketplace";

interface ProductCardProps {
  product: Product;
  onPurchase: (productId: string) => void;
  onDownload: (productId: string) => void;
  formatPrice: (price: string) => string;
  hasPurchased: (productId: string) => boolean;
  loading: boolean;
}

export function ProductCard({
  product,
  onPurchase,
  onDownload,
  formatPrice,
  hasPurchased,
  loading,
}: ProductCardProps) {
  const { account } = useWallet();

  const isOwnProduct = product.seller === String(account?.address);
  const isPurchased = hasPurchased(product.id);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
            {product.name}
          </CardTitle>
          <div className="flex flex-col items-end space-y-1">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)} APT
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              by {String(product.seller).slice(0, 6)}...
              {String(product.seller).slice(-4)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${product.is_available ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span
              className={`text-sm ${product.is_available ? "text-green-600" : "text-red-600"}`}
            >
              {product.is_available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          {isPurchased ? (
            <Button
              onClick={() => onDownload(product.id)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              📥 Download
            </Button>
          ) : isOwnProduct ? (
            <Button disabled variant="outline" className="w-full">
              Your Product
            </Button>
          ) : (
            <Button
              onClick={() => onPurchase(product.id)}
              disabled={loading || !product.is_available}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300"
            >
              {loading ? "Processing..." : "🛒 Purchase"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
