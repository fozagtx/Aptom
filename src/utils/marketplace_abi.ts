/**
 * Digital Marketplace Smart Contract ABI
 * Module: marketplace_addr::digital_marketplace
 */

export const DIGITAL_MARKETPLACE_ABI = {
  address: "marketplace_addr",
  name: "digital_marketplace",

  // Entry Functions
  entry_functions: {
    add_product: {
      name: "add_product",
      doc: "Add a new digital product to the marketplace",
      params: ["String", "String", "u64", "String"],
      param_names: ["name", "description", "price", "download_link"],
    },

    purchase_product: {
      name: "purchase_product",
      doc: "Purchase a digital product",
      params: ["u64"],
      param_names: ["product_id"],
    },

    toggle_product_availability: {
      name: "toggle_product_availability",
      doc: "Toggle product availability on/off",
      params: ["u64"],
      param_names: ["product_id"],
    },
  },

  // View Functions
  view_functions: {
    get_all_products: {
      name: "get_all_products",
      doc: "Get all products in the marketplace",
      params: [],
      return_type: "vector<Product>",
    },

    get_available_products: {
      name: "get_available_products",
      doc: "Get only available products",
      params: [],
      return_type: "vector<Product>",
    },

    get_product_by_id: {
      name: "get_product_by_id",
      doc: "Get a specific product by ID",
      params: ["u64"],
      param_names: ["product_id"],
      return_type: "Product",
    },

    get_download_link: {
      name: "get_download_link",
      doc: "Get download link for purchased product",
      params: ["address", "u64"],
      param_names: ["buyer_addr", "product_id"],
      return_type: "String",
    },

    get_user_purchases: {
      name: "get_user_purchases",
      doc: "Get all purchases by a user",
      params: ["address"],
      param_names: ["buyer_addr"],
      return_type: "vector<Purchase>",
    },

    get_seller_products: {
      name: "get_seller_products",
      doc: "Get all products by a seller",
      params: ["address"],
      param_names: ["seller_addr"],
      return_type: "vector<Product>",
    },
  },
} as const;

// Type definitions
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  download_link: string;
  seller: string;
  is_available: boolean;
}

export interface Purchase {
  product_id: string;
  buyer: string;
  seller: string;
  price_paid: string;
  timestamp: string;
}

// Helper function to build function identifiers
export function getMarketplaceFunctionId(functionName: string): string {
  return `${DIGITAL_MARKETPLACE_ABI.address}::${DIGITAL_MARKETPLACE_ABI.name}::${functionName}`;
}
