module marketplace_addr::digital_marketplace {
    use std::string::String;
    use std::vector;
    use std::signer;
    use aptos_framework::object::{Self, ExtendRef};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;

    // Error codes
    const E_PRODUCT_NOT_FOUND: u64 = 1;
    const E_INSUFFICIENT_PAYMENT: u64 = 2;
    const E_PRODUCT_NOT_AVAILABLE: u64 = 3;
    const E_NOT_PRODUCT_OWNER: u64 = 4;
    const E_ALREADY_PURCHASED: u64 = 5;

    struct Product has store, copy, drop {
        id: u64,
        name: String,
        description: String,
        price: u64, // Price in APT (smallest unit)
        download_link: String,
        seller: address,
        is_available: bool,
    }

    struct Purchase has store, copy, drop {
        product_id: u64,
        buyer: address,
        seller: address,
        price_paid: u64,
        timestamp: u64,
    }

    struct Marketplace has key {
        products: vector<Product>,
        purchases: vector<Purchase>,
        next_product_id: u64,
        extend_ref: ExtendRef,
    }

    // Events
    #[event]
    struct ProductAddedEvent has drop, store {
        product_id: u64,
        name: String,
        seller: address,
        price: u64,
    }

    #[event]
    struct ProductPurchasedEvent has drop, store {
        product_id: u64,
        buyer: address,
        seller: address,
        price: u64,
    }

    const MARKETPLACE_OBJECT_SEED: vector<u8> = b"digital_marketplace";

    // Initialize the marketplace
    fun init_module(sender: &signer) {
        let constructor_ref = &object::create_named_object(sender, MARKETPLACE_OBJECT_SEED);
        let marketplace_signer = object::generate_signer(constructor_ref);

        move_to(&marketplace_signer, Marketplace {
            products: vector::empty<Product>(),
            purchases: vector::empty<Purchase>(),
            next_product_id: 1,
            extend_ref: object::generate_extend_ref(constructor_ref),
        });
    }

    // ======================== Write Functions ========================

    public entry fun add_product(
        seller: &signer,
        name: String,
        description: String,
        price: u64,
        download_link: String,
    ) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(get_marketplace_address());
        let seller_addr = signer::address_of(seller);

        let product = Product {
            id: marketplace.next_product_id,
            name,
            description,
            price,
            download_link,
            seller: seller_addr,
            is_available: true,
        };

        vector::push_back(&mut marketplace.products, product);

        // Emit event
        event::emit(ProductAddedEvent {
            product_id: marketplace.next_product_id,
            name: product.name,
            seller: seller_addr,
            price,
        });

        marketplace.next_product_id = marketplace.next_product_id + 1;
    }

    public entry fun purchase_product(
        buyer: &signer,
        product_id: u64,
    ) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(get_marketplace_address());
        let buyer_addr = signer::address_of(buyer);

        // Find the product
        let product_index = find_product_index(&marketplace.products, product_id);
        assert!(product_index < vector::length(&marketplace.products), E_PRODUCT_NOT_FOUND);

        let product = vector::borrow(&marketplace.products, product_index);
        assert!(product.is_available, E_PRODUCT_NOT_AVAILABLE);

        // Check if already purchased by this buyer
        assert!(!has_purchased(buyer_addr, product_id, &marketplace.purchases), E_ALREADY_PURCHASED);

        // Transfer payment from buyer to seller
        coin::transfer<AptosCoin>(buyer, product.seller, product.price);

        // Record the purchase
        let purchase = Purchase {
            product_id,
            buyer: buyer_addr,
            seller: product.seller,
            price_paid: product.price,
            timestamp: aptos_framework::timestamp::now_seconds(),
        };

        vector::push_back(&mut marketplace.purchases, purchase);

        // Emit event
        event::emit(ProductPurchasedEvent {
            product_id,
            buyer: buyer_addr,
            seller: product.seller,
            price: product.price,
        });
    }

    public entry fun toggle_product_availability(
        seller: &signer,
        product_id: u64,
    ) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(get_marketplace_address());
        let seller_addr = signer::address_of(seller);

        let product_index = find_product_index(&marketplace.products, product_id);
        assert!(product_index < vector::length(&marketplace.products), E_PRODUCT_NOT_FOUND);

        let product = vector::borrow_mut(&mut marketplace.products, product_index);
        assert!(product.seller == seller_addr, E_NOT_PRODUCT_OWNER);

        product.is_available = !product.is_available;
    }

    // ======================== View Functions ========================

    #[view]
    public fun get_all_products(): vector<Product> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(get_marketplace_address());
        marketplace.products
    }

    #[view]
    public fun get_available_products(): vector<Product> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(get_marketplace_address());
        let available_products = vector::empty<Product>();
        let products = &marketplace.products;

        let i = 0;
        let len = vector::length(products);
        while (i < len) {
            let product = vector::borrow(products, i);
            if (product.is_available) {
                vector::push_back(&mut available_products, *product);
            };
            i = i + 1;
        };

        available_products
    }

    #[view]
    public fun get_product_by_id(product_id: u64): Product acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(get_marketplace_address());
        let product_index = find_product_index(&marketplace.products, product_id);
        assert!(product_index < vector::length(&marketplace.products), E_PRODUCT_NOT_FOUND);

        *vector::borrow(&marketplace.products, product_index)
    }

    #[view]
    public fun get_download_link(buyer_addr: address, product_id: u64): String acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(get_marketplace_address());

        // Verify the buyer has purchased this product
        assert!(has_purchased(buyer_addr, product_id, &marketplace.purchases), E_ALREADY_PURCHASED);

        let product = get_product_by_id(product_id);
        product.download_link
    }

    #[view]
    public fun get_user_purchases(buyer_addr: address): vector<Purchase> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(get_marketplace_address());
        let user_purchases = vector::empty<Purchase>();
        let purchases = &marketplace.purchases;

        let i = 0;
        let len = vector::length(purchases);
        while (i < len) {
            let purchase = vector::borrow(purchases, i);
            if (purchase.buyer == buyer_addr) {
                vector::push_back(&mut user_purchases, *purchase);
            };
            i = i + 1;
        };

        user_purchases
    }

    #[view]
    public fun get_seller_products(seller_addr: address): vector<Product> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(get_marketplace_address());
        let seller_products = vector::empty<Product>();
        let products = &marketplace.products;

        let i = 0;
        let len = vector::length(products);
        while (i < len) {
            let product = vector::borrow(products, i);
            if (product.seller == seller_addr) {
                vector::push_back(&mut seller_products, *product);
            };
            i = i + 1;
        };

        seller_products
    }

    // ======================== Test Helper Functions ========================

    #[test_only]
    public fun get_product_id(product: &Product): u64 {
        product.id
    }

    #[test_only]
    public fun get_product_name(product: &Product): String {
        product.name
    }

    #[test_only]
    public fun get_product_price(product: &Product): u64 {
        product.price
    }

    #[test_only]
    public fun get_product_availability(product: &Product): bool {
        product.is_available
    }

    #[test_only]
    public fun get_purchase_product_id(purchase: &Purchase): u64 {
        purchase.product_id
    }

    #[test_only]
    public fun get_purchase_buyer(purchase: &Purchase): address {
        purchase.buyer
    }

    #[test_only]
    public fun get_purchase_price_paid(purchase: &Purchase): u64 {
        purchase.price_paid
    }

    // ======================== Helper Functions ========================

    fun get_marketplace_address(): address {
        object::create_object_address(&@marketplace_addr, MARKETPLACE_OBJECT_SEED)
    }

    fun find_product_index(products: &vector<Product>, product_id: u64): u64 {
        let i = 0;
        let len = vector::length(products);
        while (i < len) {
            let product = vector::borrow(products, i);
            if (product.id == product_id) {
                return i
            };
            i = i + 1;
        };
        len // Return length if not found (invalid index)
    }

    fun has_purchased(buyer_addr: address, product_id: u64, purchases: &vector<Purchase>): bool {
        let i = 0;
        let len = vector::length(purchases);
        while (i < len) {
            let purchase = vector::borrow(purchases, i);
            if (purchase.buyer == buyer_addr && purchase.product_id == product_id) {
                return true
            };
            i = i + 1;
        };
        false
    }

    // ======================== Unit Tests ========================

    #[test_only]
    public fun init_module_for_test(sender: &signer) {
        init_module(sender);
    }
}
