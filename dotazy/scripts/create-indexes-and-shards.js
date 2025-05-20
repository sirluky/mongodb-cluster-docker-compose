// Přepnutí na databázi ecommerce
use ecommerce

// Povolení shardingu pro databázi
sh.enableBalancing("ecommerce");
sh.enableSharding("ecommerce");

// Indexy pro kolekci orders
db.orders.createIndex({ "_id": 1 });
db.orders.createIndex({ "customer_id": 1 });
db.orders.createIndex({ "order_status": 1 });
db.orders.createIndex({ "items.product_id": 1 });
db.orders.createIndex({
    "items.product_id": 1,
    "items.price": 1
});

// Indexy pro kolekci products
db.products.createIndex({ "_id": 1 });
db.products.createIndex({ "product_category_name": 1 });


// Indexy pro kolekci customers
db.customers.createIndex({ "_id": 1 });
db.customers.createIndex({ "customer_id": 1 });
db.customers.createIndex({ "customer_unique_id": 1 });
db.customers.createIndex({ "customer_state": 1 });
db.customers.createIndex({ "customer_city": 1 });

// Nastavení shardování pro kolekce
sh.shardCollection("ecommerce.orders", { "_id": "hashed" });
sh.shardCollection("ecommerce.products", { "_id": "hashed" });
sh.shardCollection("ecommerce.customers", { "_id": "hashed" });
