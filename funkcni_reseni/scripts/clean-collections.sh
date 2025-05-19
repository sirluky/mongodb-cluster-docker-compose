#!/bin/bash

mongosh -u admin_lukas -p 123 --authenticationDatabase admin << EOF
use ecommerce

db.orders.drop()
db.order_items.drop()
db.products.drop()
db.customers.drop()

db.createCollection("orders")
db.createCollection("order_items")
db.createCollection("products")
db.createCollection("customers")

exit
EOF