#[test_only]
module marketplace_addr::marketplace_tests {
    use std::string;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::timestamp;
    use marketplace_addr::digital_marketplace;

    const TEST_PRODUCT_PRICE: u64 = 1000000; // 1 APT in smallest units

    #[test(aptos_framework = @0x1, marketplace_admin = @marketplace_addr, seller = @0x123, buyer = @0x456)]
    public fun test_add_product(aptos_framework: &signer, marketplace_admin: &signer, seller: &signer, buyer: &signer) {
        // Setup
        setup_test(aptos_framework, seller, buyer);
        digital_marketplace::init_module_for_test(marketplace_admin);

        // Add a product
        digital_marketplace::add_product(
            seller,
            string::utf8(b"Test Product"),
            string::utf8(b"A great digital product"),
            TEST_PRODUCT_PRICE,
            string::utf8(b"https://example.com/download/123")
        );

        // Verify product was added
        let products = digital_marketplace::get_all_products();
        assert!(vector::length(&products) == 1, 1);

        let product = vector::borrow(&products, 0);
        assert!(digital_marketplace::get_product_id(product) == 1, 2);
        assert!(digital_marketplace::get_product_name(product) == string::utf8(b"Test Product"), 3);
        assert!(digital_marketplace::get_product_price(product) == TEST_PRODUCT_PRICE, 4);
        assert!(digital_marketplace::get_product_availability(product) == true, 5);
    }

    #[test(aptos_framework = @0x1, marketplace_admin = @marketplace_addr, seller = @0x123, buyer = @0x456)]
    public fun test_purchase_product(aptos_framework: &signer, marketplace_admin: &signer, seller: &signer, buyer: &signer) {
        // Setup
        setup_test(aptos_framework, seller, buyer);
        digital_marketplace::init_module_for_test(marketplace_admin);

        // Add a product
        digital_marketplace::add_product(
            seller,
            string::utf8(b"Test Product"),
            string::utf8(b"A great digital product"),
            TEST_PRODUCT_PRICE,
            string::utf8(b"https://example.com/download/123")
        );

        // Purchase the product
        digital_marketplace::purchase_product(buyer, 1);

        // Verify purchase was recorded
        let purchases = digital_marketplace::get_user_purchases(@0x456);
        assert!(vector::length(&purchases) == 1, 6);

        let purchase = vector::borrow(&purchases, 0);
        assert!(digital_marketplace::get_purchase_product_id(purchase) == 1, 7);
        assert!(digital_marketplace::get_purchase_buyer(purchase) == @0x456, 8);
        assert!(digital_marketplace::get_purchase_price_paid(purchase) == TEST_PRODUCT_PRICE, 9);
    }

    // Helper function to set up test environment
    fun setup_test(aptos_framework: &signer, seller: &signer, buyer: &signer) {
        timestamp::set_time_has_started_for_testing(aptos_framework);

        // Initialize AptosCoin
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        // Register both accounts for APT
        coin::register<AptosCoin>(seller);
        coin::register<AptosCoin>(buyer);

        // Give buyer some APT to make purchases
        let coins = coin::mint<AptosCoin>(TEST_PRODUCT_PRICE * 10, &mint_cap);
        coin::deposit<AptosCoin>(@0x456, coins);

        // Clean up capabilities
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
