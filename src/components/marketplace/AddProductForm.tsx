import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewProductForm } from "@/types/marketplace";

interface AddProductFormProps {
  onAddProduct: (product: NewProductForm) => Promise<boolean>;
  loading: boolean;
}

export function AddProductForm({ onAddProduct, loading }: AddProductFormProps) {
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: "",
    description: "",
    price: "",
    downloadLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onAddProduct(newProduct);
    if (success) {
      setNewProduct({ name: "", description: "", price: "", downloadLink: "" });
    }
  };

  return (
    <Card className="mb-8 border border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <span>✨</span>
          <span>Add New Product</span>
        </CardTitle>
        <CardDescription>
          List a new digital product for sale on the marketplace
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium text-gray-700">
                Product Name *
              </Label>
              <Input
                id="productName"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g., Premium Design Templates"
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPrice" className="text-sm font-medium text-gray-700">
                Price (APT) *
              </Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                min="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="e.g., 5.0"
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productDescription" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Input
              id="productDescription"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Describe your digital product..."
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="downloadLink" className="text-sm font-medium text-gray-700">
              Download Link *
            </Label>
            <Input
              id="downloadLink"
              type="url"
              value={newProduct.downloadLink}
              onChange={(e) => setNewProduct({ ...newProduct, downloadLink: e.target.value })}
              placeholder="https://your-file-hosting.com/download"
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-lg font-medium"
          >
            {loading ? "Adding Product..." : "🚀 Add Product to Marketplace"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
