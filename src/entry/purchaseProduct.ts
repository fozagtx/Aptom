import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type PurchaseProductArguments = {
  productId: string;
};

export const purchaseProduct = (
  args: PurchaseProductArguments,
): InputTransactionData => {
  return {
    data: {
      function: `${MODULE_ADDRESS}::digital_marketplace::purchase_product`,
      functionArguments: [args.productId],
    },
  };
};
