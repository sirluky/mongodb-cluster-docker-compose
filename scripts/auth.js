#!/bin/bash

mongosh <<EOF
use admin;
db.createUser({user: "lukas", pwd: "123", roles:[{role: "root", db: "admin"}]});
exit;
EOF