import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";
import { Product } from "@/utils/marketplace_abi";

export const getSellerProducts = async (sellerAddress: string): Promise<Product[]> => {
  try {
    const response = await aptosClient().view({
      payload: {
        function: `${MODULE_ADDRESS}::digital_marketplace::get_seller_products`,
        functionArguments: [sellerAddress],
      },
    });

    // Transform the response to match our Product interface
    const products = response[0] as any[];
    return products.map((product: any) => ({
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      download_link: product.download_link,
      seller: product.seller,
      is_available: product.is_available
    }));
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return [];
  }
};
