import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type ToggleProductAvailabilityArguments = {
  productId: string;
};

export const toggleProductAvailability = (
  args: ToggleProductAvailabilityArguments,
): InputTransactionData => {
  return {
    data: {
      function: `${MODULE_ADDRESS}::digital_marketplace::toggle_product_availability`,
      functionArguments: [args.productId],
    },
  };
};
