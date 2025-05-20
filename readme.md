# How to use

```bash
# Prikaz pro spusteni
make setup

# Nasledne pripojeni do DB
mongosh "mongodb://admin_lukas:123@127.0.0.1:27117,127.0.0.1:27118/?authMechanism=DEFAULT"
```

### Dataset
Jako dataset byl použit https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce.

### Cluster repozitář
MongoDB (6.0.2) Sharded Cluster - Keyfile Authentication
https://github.com/minhhungit/mongodb-cluster-docker-compose
