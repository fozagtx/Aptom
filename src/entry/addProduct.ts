import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type AddProductArguments = {
  name: string;
  description: string;
  price: string; // Price in APT (will be converted to smallest units)
  downloadLink: string;
};

export const addProduct = (args: AddProductArguments): InputTransactionData => {
  // Convert price from APT to smallest units (1 APT = 100,000,000 units)
  const priceInSmallestUnits = Math.floor(
    parseFloat(args.price) * 100_000_000,
  ).toString();

  return {
    data: {
      function: `${MODULE_ADDRESS}::digital_marketplace::add_product`,
      functionArguments: [
        args.name,
        args.description,
        priceInSmallestUnits,
        args.downloadLink,
      ],
    },
  };
};
