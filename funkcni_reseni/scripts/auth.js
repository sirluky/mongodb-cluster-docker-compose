#!/bin/bash

mongosh <<EOF
use admin
db.createUser({user: "admin_lukas", pwd: "123", roles:[{role: "root", db: "admin"}]})
exit
EOF

mongosh -u admin_lukas -p 123 --authenticationDatabase admin <<EOF
use ecommerce
// Create ecommerce_user with both readWrite and dbAdmin roles to allow schema validation
db.createUser({user: "ecommerce_user", pwd: "ecommerce123", roles:[{role: "readWrite", db: "ecommerce"}, {role: "dbAdmin", db: "ecommerce"}]})
db.createUser({user: "ecommerce_reader", pwd: "reader123", roles:[{role: "read", db: "ecommerce"}]})    
exit
EOF