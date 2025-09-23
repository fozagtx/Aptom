import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Purchase } from "@/types/marketplace";

interface PurchaseCardProps {
  purchase: Purchase;
  onDownload: (productId: string) => void;
  formatPrice: (price: string) => string;
}

export function PurchaseCard({ purchase, onDownload, formatPrice }: PurchaseCardProps) {
  return (
    <Card className="h-full border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Product #{purchase.product_id}
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Purchased for {formatPrice(purchase.price_paid)} APT</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            ✅ Owned
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-xs text-gray-500 space-y-1">
            <div><strong>Seller:</strong> {String(purchase.seller).slice(0, 8)}...{String(purchase.seller).slice(-4)}</div>
            <div><strong>Purchase Date:</strong> {new Date(parseInt(purchase.timestamp) * 1000).toLocaleDateString()}</div>
          </div>

          <Button
            onClick={() => onDownload(purchase.product_id)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            📥 Download Product
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
