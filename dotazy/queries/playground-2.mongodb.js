/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('ecommerce');

// Search for documents in the current collection.
db.getCollection('order_items')
    .find(
        {
            order_item_id: 1,

        },
        {
            id: 0,
            order_id: 0,
            product_id: 0,
            quantity: 0,
            price: 0,
            total_price: 0,
            created_at: 0,
            updated_at: 0,
            freight_value: 0
        }
    )
    .sort({
        /*
        * fieldA: 1 // ascending
        * fieldB: -1 // descending
        */
    });
