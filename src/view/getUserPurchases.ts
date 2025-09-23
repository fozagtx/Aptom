import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";
import { Purchase } from "@/utils/marketplace_abi";

export const getUserPurchases = async (userAddress: string): Promise<Purchase[]> => {
  try {
    const response = await aptosClient().view({
      payload: {
        function: `${MODULE_ADDRESS}::digital_marketplace::get_user_purchases`,
        functionArguments: [userAddress],
      },
    });

    // Transform the response to match our Purchase interface
    const purchases = response[0] as any[];
    return purchases.map((purchase: any) => ({
      product_id: purchase.product_id.toString(),
      buyer: purchase.buyer,
      seller: purchase.seller,
      price_paid: purchase.price_paid.toString(),
      timestamp: purchase.timestamp.toString()
    }));
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    return [];
  }
};
