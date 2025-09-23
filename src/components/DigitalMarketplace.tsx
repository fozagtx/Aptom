"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getAvailableProducts } from "@/view-functions/getAvailableProducts";
import { getUserPurchases } from "@/view-functions/getUserPurchases";
import { getSellerProducts } from "@/view-functions/getSellerProducts";
import { getDownloadLink } from "@/view-functions/getDownloadLink";
import { addProduct } from "@/entry-functions/addProduct";
import { purchaseProduct } from "@/entry-functions/purchaseProduct";
import { toggleProductAvailability } from "@/entry-functions/toggleProductAvailability";
import { Product, Purchase } from "@/utils/marketplace_abi";

export function DigitalMarketplace() {
  const { account, signAndSubmitTransaction, disconnect } = useWallet();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [userPurchases, setUserPurchases] = useState<Purchase[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "purchases" | "sell">(
    "browse",
  );

  // Add product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    downloadLink: "",
  });

  useEffect(() => {
    loadProducts();
    if (account?.address) {
      loadUserData();
    }
  }, [account?.address]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const availableProducts = await getAvailableProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!account?.address) return;

    try {
      const [purchases, sellerItems] = await Promise.all([
        getUserPurchases(String(account.address)),
        getSellerProducts(String(account.address)),
      ]);
      setUserPurchases(purchases);
      setSellerProducts(sellerItems);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleAddProduct = async () => {
    if (!account?.address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    if (
      !newProduct.name ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.downloadLink
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const transaction = await addProduct(newProduct);
      const response = await signAndSubmitTransaction(transaction);

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      // Reset form
      setNewProduct({ name: "", description: "", price: "", downloadLink: "" });

      // Reload data
      await loadProducts();
      await loadUserData();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseProduct = async (productId: string) => {
    if (!account?.address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const transaction = await purchaseProduct({ productId });
      const response = await signAndSubmitTransaction(transaction);

      toast({
        title: "Success",
        description: "Product purchased successfully!",
      });

      // Reload data
      await loadProducts();
      await loadUserData();
    } catch (error) {
      console.error("Error purchasing product:", error);
      toast({
        title: "Error",
        description: "Failed to purchase product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (productId: string) => {
    if (!account?.address) return;

    setLoading(true);
    try {
      const transaction = await toggleProductAvailability({ productId });
      const response = await signAndSubmitTransaction(transaction);

      toast({
        title: "Success",
        description: "Product availability updated!",
      });

      await loadProducts();
      await loadUserData();
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast({
        title: "Error",
        description: "Failed to update product availability",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetDownloadLink = async (productId: string) => {
    if (!account?.address) return;

    try {
      const downloadLink = await getDownloadLink(
        String(account.address),
        productId,
      );
      if (downloadLink) {
        window.open(downloadLink, "_blank");
      } else {
        toast({
          title: "Error",
          description: "Download link not available",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error getting download link:", error);
      toast({
        title: "Error",
        description: "Failed to get download link",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: string) => {
    return (parseInt(price) / 100_000_000).toFixed(2);
  };

  const hasPurchased = (productId: string) => {
    return userPurchases.some((purchase) => purchase.product_id === productId);
  };

  return (
    <div className="space-y-6">
      {/* Header with wallet info and disconnect */}
      <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow mb-4">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-lg text-gray-700">
            Digital Marketplace
          </span>
          {account?.address && (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Connected: {account.address.slice(0, 6)}...
              {account.address.slice(-4)}
            </span>
          )}
        </div>
        {account?.address && (
          <Button
            variant="outline"
            className="ml-4"
            onClick={() => disconnect()}
          >
            Disconnect Wallet
          </Button>
        )}
      </div>
      <div className="flex space-x-4 border-b">
        <button
          className={`pb-2 px-1 ${activeTab === "browse" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("browse")}
        >
          Browse Products
        </button>
        <button
          className={`pb-2 px-1 ${activeTab === "purchases" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("purchases")}
        >
          My Purchases
        </button>
        <button
          className={`pb-2 px-1 ${activeTab === "sell" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("sell")}
        >
          Sell Products
        </button>
      </div>

      {activeTab === "browse" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Digital Marketplace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="h-full">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">
                      {formatPrice(product.price)} APT
                    </span>
                    <span className="text-sm text-gray-500">
                      by {product.seller.slice(0, 6)}...
                      {product.seller.slice(-4)}
                    </span>
                  </div>

                  {hasPurchased(product.id) ? (
                    <Button
                      onClick={() => handleGetDownloadLink(product.id)}
                      className="w-full"
                      variant="outline"
                    >
                      Download
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePurchaseProduct(product.id)}
                      disabled={
                        loading || product.seller === String(account?.address)
                      }
                      className="w-full"
                    >
                      {product.seller === String(account?.address)
                        ? "Your Product"
                        : "Purchase"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "purchases" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPurchases.map((purchase) => {
              const product = products.find(
                (p) => p.id === purchase.product_id,
              );
              return (
                <Card key={purchase.product_id}>
                  <CardHeader>
                    <CardTitle>Product #{purchase.product_id}</CardTitle>
                    <CardDescription>
                      Purchased for {formatPrice(purchase.price_paid)} APT
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleGetDownloadLink(purchase.product_id)}
                      className="w-full"
                    >
                      Download
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "sell" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Sell Your Products</h2>

          {/* Add Product Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>
                List a new digital product for sale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="productDescription">Description</Label>
                <Input
                  id="productDescription"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <Label htmlFor="productPrice">Price (APT)</Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  placeholder="Enter price in APT"
                />
              </div>

              <div>
                <Label htmlFor="downloadLink">Download Link</Label>
                <Input
                  id="downloadLink"
                  value={newProduct.downloadLink}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      downloadLink: e.target.value,
                    })
                  }
                  placeholder="Enter download URL"
                />
              </div>

              <Button
                onClick={handleAddProduct}
                disabled={loading}
                className="w-full"
              >
                Add Product
              </Button>
            </CardContent>
          </Card>

          {/* Seller's Products */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellerProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">
                        {formatPrice(product.price)} APT
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          product.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.is_available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleToggleAvailability(product.id)}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      {product.is_available ? "Disable" : "Enable"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
