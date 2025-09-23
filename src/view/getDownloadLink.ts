import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";

export const getDownloadLink = async (buyerAddress: string, productId: string): Promise<string | null> => {
  try {
    const response = await aptosClient().view({
      payload: {
        function: `${MODULE_ADDRESS}::digital_marketplace::get_download_link`,
        functionArguments: [buyerAddress, productId],
      },
    });

    return response[0] as string;
  } catch (error) {
    console.error("Error fetching download link:", error);
    return null;
  }
};
