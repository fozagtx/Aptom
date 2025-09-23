import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/marketplace";

interface SellerProductCardProps {
  product: Product;
  onToggleAvailability: (productId: string) => void;
  formatPrice: (price: string) => string;
  loading: boolean;
}

export function SellerProductCard({
  product,
  onToggleAvailability,
  formatPrice,
  loading,
}: SellerProductCardProps) {
  return (
    <Card className="h-full border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {product.name}
          </CardTitle>
          <div className="flex flex-col items-end space-y-2">
            <span className="text-xl font-bold text-green-600">
              {formatPrice(product.price)} APT
            </span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                product.is_available
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.is_available ? "🟢 Available" : "🔴 Unavailable"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="space-y-3">
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <strong>Product ID:</strong> #{product.id}
          </div>

          <Button
            onClick={() => onToggleAvailability(product.id)}
            disabled={loading}
            variant={product.is_available ? "destructive" : "default"}
            className="w-full"
          >
            {loading
              ? "Updating..."
              : product.is_available
                ? "🚫 Disable Product"
                : "✅ Enable Product"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
