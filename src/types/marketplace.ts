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

export interface NewProductForm {
  name: string;
  description: string;
  price: string;
  downloadLink: string;
}

export type MarketplaceTab = "browse" | "purchases" | "sell";
