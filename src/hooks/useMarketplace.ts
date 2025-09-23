import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "@/components/ui/use-toast";
import { Product, Purchase, NewProductForm } from "@/types/marketplace";
import { getAvailableProducts } from "@/view/getAvailableProducts";
import { getUserPurchases } from "@/view/getUserPurchases";
import { getSellerProducts } from "@/view/getSellerProducts";
import { getDownloadLink } from "@/view/getDownloadLink";
import { addProduct } from "@/entry/addProduct";
import { purchaseProduct } from "@/entry/purchaseProduct";
import { toggleProductAvailability } from "@/entry/toggleProductAvailability";
import { getErrorMessage } from "@/utils/errorHandler";

export function useMarketplace() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [userPurchases, setUserPurchases] = useState<Purchase[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Download modal state
  const [downloadModal, setDownloadModal] = useState<{
    isOpen: boolean;
    downloadLink: string;
    productName: string;
  }>({
    isOpen: false,
    downloadLink: "",
    productName: "",
  });

  // Purchase success modal state
  const [purchaseModal, setPurchaseModal] = useState<{
    isOpen: boolean;
    productName: string;
    price: string;
  }>({
    isOpen: false,
    productName: "",
    price: "",
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const availableProducts = await getAvailableProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadUserData = useCallback(async () => {
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
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    }
  }, [account?.address, toast]);

  const handleAddProduct = async (newProduct: NewProductForm) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to add products",
        variant: "destructive",
      });
      return false;
    }

    if (!account?.address) {
      toast({
        title: "Account Loading",
        description: "Please wait for your account to load, then try again",
        variant: "destructive",
      });
      return false;
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
      return false;
    }

    setLoading(true);
    try {
      const transaction = await addProduct(newProduct);
      await signAndSubmitTransaction(transaction);

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      await Promise.all([loadProducts(), loadUserData()]);
      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseProduct = async (productId: string) => {
    // Enhanced wallet state checking
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase products",
        variant: "destructive",
      });
      return false;
    }

    if (!account?.address) {
      toast({
        title: "Account Loading",
        description: "Please wait for your account to load, then try again",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      // Find product details for celebration modal
      const product = products.find((p) => p.id === productId);
      const productName = product?.name || `Product #${productId}`;
      const price = product ? formatPrice(product.price) : "0.00";

      const transaction = await purchaseProduct({ productId });
      await signAndSubmitTransaction(transaction);

      // Show celebration modal instead of toast
      setPurchaseModal({
        isOpen: true,
        productName,
        price,
      });

      await Promise.all([loadProducts(), loadUserData()]);
      return true;
    } catch (error) {
      console.error("Error purchasing product:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (productId: string) => {
    if (!connected || !account?.address) {
      toast({
        title: "Wallet Required",
        description:
          "Please ensure your wallet is connected and account is loaded",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      const transaction = await toggleProductAvailability({ productId });
      await signAndSubmitTransaction(transaction);

      toast({
        title: "Success",
        description: "Product availability updated!",
      });

      await Promise.all([loadProducts(), loadUserData()]);
      return true;
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast({
        title: "Error",
        description: "Failed to update product availability",
        variant: "destructive",
      });
      return false;
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
        // Find product name for the modal
        const allProducts = [...products, ...sellerProducts];
        const product = allProducts.find((p) => p.id === productId);
        const productName = product?.name || `Product #${productId}`;

        // Show celebration modal instead of redirecting
        setDownloadModal({
          isOpen: true,
          downloadLink,
          productName,
        });
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

  const closeDownloadModal = () => {
    setDownloadModal({
      isOpen: false,
      downloadLink: "",
      productName: "",
    });
  };

  const closePurchaseModal = () => {
    setPurchaseModal({
      isOpen: false,
      productName: "",
      price: "",
    });
  };

  const formatPrice = (price: string) => {
    return (parseInt(price) / 100_000_000).toFixed(2);
  };

  const hasPurchased = (productId: string) => {
    return userPurchases.some((purchase) => purchase.product_id === productId);
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (account?.address) {
      loadUserData();
    }
  }, [account?.address, loadUserData]);

  return {
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
    loadProducts,
    loadUserData,
    // Download modal state
    downloadModal,
    closeDownloadModal,
    // Purchase modal state
    purchaseModal,
    closePurchaseModal,
  };
}
