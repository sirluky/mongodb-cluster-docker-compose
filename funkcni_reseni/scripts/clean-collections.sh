use ecommerce

db.orders.drop()
db.order_items.drop()
db.products.drop()
db.customers.drop()

db.createCollection("orders")
db.createCollection("order_items")
db.createCollection("products")
db.createCollection("customers")
