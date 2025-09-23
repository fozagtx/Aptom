"use client";

import { useState } from "react";
import { MarketplaceTab } from "@/types/marketplace";
import { useMarketplace } from "@/hooks/useMarketplace";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { TabNavigation } from "./TabNavigation";
import { ProductCard } from "./ProductCard";
import { AddProductForm } from "./AddProductForm";
import { SellerProductCard } from "./SellerProductCard";
import { PurchaseCard } from "./PurchaseCard";
import { DownloadSuccessModal } from "@/components/ui/DownloadSuccessModal";
import { PurchaseSuccessModal } from "@/components/ui/PurchaseSuccessModal";

export function DigitalMarketplace() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>("browse");

  const {
    products,
    userPurchases,
    sellerProducts,
    loading,
    handleAddProduct,
    handlePurchaseProduct,
    handleToggleAvailability,
    handleGetDownloadLink,
    formatPrice,
    hasPurchased,
    downloadModal,
    closeDownloadModal,
    purchaseModal,
    closePurchaseModal,
  } = useMarketplace();

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <MarketplaceHeader />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading marketplace...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <MarketplaceHeader />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Browse Products Tab */}
        {activeTab === "browse" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Browse Products
                </h2>
                <p className="text-gray-600">
                  Discover digital products on the Aptos blockchain
                </p>
              </div>
              <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
                {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                available
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products available
                </h3>
                <p className="text-gray-600">
                  Be the first to list a product on the marketplace!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPurchase={handlePurchaseProduct}
                    onDownload={handleGetDownloadLink}
                    formatPrice={formatPrice}
                    hasPurchased={hasPurchased}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Purchases Tab */}
        {activeTab === "purchases" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  My Purchases
                </h2>
                <p className="text-gray-600">
                  Products you own and can download
                </p>
              </div>
              <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
                {userPurchases.length} purchase
                {userPurchases.length !== 1 ? "s" : ""}
              </div>
            </div>

            {userPurchases.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No purchases yet
                </h3>
                <p className="text-gray-600">
                  Browse the marketplace to find products you like!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPurchases.map((purchase) => (
                  <PurchaseCard
                    key={purchase.product_id}
                    purchase={purchase}
                    onDownload={handleGetDownloadLink}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sell Products Tab */}
        {activeTab === "sell" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Sell Your Products
              </h2>
              <p className="text-gray-600">
                List and manage your digital products
              </p>
            </div>

            <AddProductForm onAddProduct={handleAddProduct} loading={loading} />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Your Products
                </h3>
                <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
                  {sellerProducts.length} product
                  {sellerProducts.length !== 1 ? "s" : ""} listed
                </div>
              </div>

              {sellerProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No products listed
                  </h3>
                  <p className="text-gray-600">
                    Add your first product above to start selling!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sellerProducts.map((product) => (
                    <SellerProductCard
                      key={product.id}
                      product={product}
                      onToggleAvailability={handleToggleAvailability}
                      formatPrice={formatPrice}
                      loading={loading}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Purchase Success Modal */}
      <PurchaseSuccessModal
        isOpen={purchaseModal.isOpen}
        onClose={closePurchaseModal}
        productName={purchaseModal.productName}
        price={purchaseModal.price}
      />

      {/* Download Success Modal */}
      <DownloadSuccessModal
        isOpen={downloadModal.isOpen}
        onClose={closeDownloadModal}
        downloadLink={downloadModal.downloadLink}
        productName={downloadModal.productName}
      />
    </div>
  );
}
