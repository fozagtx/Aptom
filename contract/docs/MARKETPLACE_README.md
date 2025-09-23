# Digital Marketplace Smart Contract

A decentralized marketplace for selling digital products on the Aptos blockchain. Sellers can list digital products with downloadable content, and buyers can purchase them using APT tokens.

## Features

- **Add Digital Products**: Sellers can list products with name, description, price, and download link
- **Purchase Products**: Buyers can purchase products using APT tokens
- **Secure Downloads**: Only buyers who purchased a product can access download links
- **Product Management**: Sellers can toggle product availability
- **Purchase History**: Track all purchases and seller products
- **Event Emissions**: Product additions and purchases emit events

## Contract Functions

### Entry Functions (Transaction Functions)

#### `add_product`
```move
public entry fun add_product(
    seller: &signer,
    name: String,
    description: String,
    price: u64,
    download_link: String,
)
```
Allows sellers to add new digital products to the marketplace.

**Parameters:**
- `seller`: The account adding the product
- `name`: Product name
- `description`: Product description
- `price`: Price in APT (smallest unit, 1 APT = 100,000,000 units)
- `download_link`: URL where buyers can download the product

#### `purchase_product`
```move
public entry fun purchase_product(
    buyer: &signer,
    product_id: u64,
)
```
Allows users to purchase a digital product.

**Parameters:**
- `buyer`: The account purchasing the product
- `product_id`: ID of the product to purchase

**Requirements:**
- Product must exist and be available
- Buyer must not have already purchased this product
- Buyer must have sufficient APT balance

#### `toggle_product_availability`
```move
public entry fun toggle_product_availability(
    seller: &signer,
    product_id: u64,
)
```
Allows sellers to enable/disable their products.

**Parameters:**
- `seller`: The product owner
- `product_id`: ID of the product to toggle

### View Functions (Read-only)

#### `get_all_products(): vector<Product>`
Returns all products in the marketplace.

#### `get_available_products(): vector<Product>`
Returns only available products for purchase.

#### `get_product_by_id(product_id: u64): Product`
Returns details of a specific product.

#### `get_download_link(buyer_addr: address, product_id: u64): String`
Returns the download link for a purchased product.
**Note**: Only works if the buyer has purchased the product.

#### `get_user_purchases(buyer_addr: address): vector<Purchase>`
Returns all purchases made by a specific user.

#### `get_seller_products(seller_addr: address): vector<Product>`
Returns all products listed by a specific seller.

## Data Structures

### Product
```move
struct Product has store, copy, drop {
    id: u64,
    name: String,
    description: String,
    price: u64,
    download_link: String,
    seller: address,
    is_available: bool,
}
```

### Purchase
```move
struct Purchase has store, copy, drop {
    product_id: u64,
    buyer: address,
    seller: address,
    price_paid: u64,
    timestamp: u64,
}
```

## Events

### ProductAddedEvent
Emitted when a new product is added.

### ProductPurchasedEvent
Emitted when a product is purchased.

## Error Codes

- `E_PRODUCT_NOT_FOUND (1)`: Product doesn't exist
- `E_INSUFFICIENT_PAYMENT (2)`: Not enough APT to purchase
- `E_PRODUCT_NOT_AVAILABLE (3)`: Product is not available for purchase
- `E_NOT_PRODUCT_OWNER (4)`: Only product owner can modify it
- `E_ALREADY_PURCHASED (5)`: User already purchased this product

## Usage Examples

### Frontend Integration

#### Add a Product
```typescript
const payload = {
  type: "entry_function_payload",
  function: `${CONTRACT_ADDRESS}::digital_marketplace::add_product`,
  arguments: [
    "My Digital Course",
    "Learn blockchain development",
    "100000000", // 1 APT
    "https://mysite.com/download/course123"
  ],
  type_arguments: []
};
```

#### Purchase a Product
```typescript
const payload = {
  type: "entry_function_payload",
  function: `${CONTRACT_ADDRESS}::digital_marketplace::purchase_product`,
  arguments: ["1"], // product ID
  type_arguments: []
};
```

#### Get Available Products
```typescript
const products = await client.view({
  function: `${CONTRACT_ADDRESS}::digital_marketplace::get_available_products`,
  arguments: [],
  type_arguments: []
});
```

#### Get Download Link (after purchase)
```typescript
const downloadLink = await client.view({
  function: `${CONTRACT_ADDRESS}::digital_marketplace::get_download_link`,
  arguments: [buyerAddress, "1"], // buyer address, product ID
  type_arguments: []
});
```

## Deployment Instructions

1. **Compile the contract:**
   ```bash
   cd contract
   aptos move compile --dev
   ```

2. **Run tests:**
   ```bash
   aptos move test --dev
   ```

3. **Deploy to network:**
   ```bash
   aptos move publish --named-addresses message_board_addr=<YOUR_ADDRESS>
   ```

## Frontend Integration Guide

1. **List Products**: Call `get_available_products()` to display products
2. **Product Details**: Use `get_product_by_id()` for individual product pages
3. **Purchase Flow**: 
   - Check user's APT balance
   - Call `purchase_product()` 
   - Show transaction confirmation
4. **Download Access**: After successful purchase, call `get_download_link()`
5. **Seller Dashboard**: Use `get_seller_products()` for seller's product management
6. **Purchase History**: Use `get_user_purchases()` for user's purchase history

## Security Features

- **Payment Verification**: Automatic APT transfer from buyer to seller
- **Access Control**: Only purchasers can access download links
- **Ownership Verification**: Only product owners can modify their products
- **Duplicate Purchase Prevention**: Users cannot purchase the same product twice
- **Object-based Architecture**: Uses Aptos object model for secure resource management

## Gas Costs

- Adding a product: ~1,000-2,000 gas units
- Purchasing a product: ~2,000-3,000 gas units
- Toggling availability: ~500-1,000 gas units
- View functions: Free (no gas cost)