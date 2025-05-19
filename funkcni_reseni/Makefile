# MongoDB cluster management

docker-down-clean:
	docker compose down -v -t 0

docker-up:
	docker compose up -d

# Initialize config server
docker-init-configserver:
	docker compose exec configsvr01 bash "/scripts/init-configserver.js"

# Initialize shard 01
docker-init-shard01:
	docker compose exec shard01-a bash "/scripts/init-shard01.js"

# Initialize shard 02
docker-init-shard02:
	docker compose exec shard02-a bash "/scripts/init-shard02.js"

# Initialize shard 03
docker-init-shard03:
	docker compose exec shard03-a bash "/scripts/init-shard03.js"

# Initialize router
docker-init-router:
	docker compose exec router01 sh -c "mongosh < /scripts/init-router.js"

# Setup authentication
docker-auth:
	docker compose exec configsvr01 bash "/scripts/auth.sh"

docker-create-indexes-and-shards:
	cat ../dotazy/scripts/create-indexes-and-shards.js | docker compose exec -T router01 mongosh -u ecommerce_user -p ecommerce123 --authenticationDatabase ecommerce

docker-insert-data:
	docker compose exec seeder python /scripts/insert_customers.py
	docker compose exec seeder python /scripts/insert_orders.py
	docker compose exec seeder python /scripts/insert_products.py

# Full initialization sequence
setup:
	$(MAKE) docker-down-clean
	$(MAKE) docker-up; \
	sleep 5; \
	$(MAKE) docker-init-configserver; \
	sleep 5; \
	$(MAKE) docker-init-shard01; \
	sleep 1; \
	$(MAKE) docker-init-shard02; \
	sleep 1; \
	$(MAKE) docker-init-shard03; \
	sleep 1; \
	$(MAKE) docker-init-router; \
	sleep 5; \
	$(MAKE) docker-auth; \
	sleep 3; \
	$(MAKE) docker-create-indexes-and-shards
	$(MAKE) docker-insert-data

# Connect to MongoDB shell via router
docker-connect-router:
	docker compose exec router01 mongosh --port 27017 -u "ecommerce_user" --authenticationDatabase admin

# Remove all stopped containers
docker-rm:
	docker compose rm

docker-setup-data:
	cat ./scripts/clean-collections.sh | docker compose exec -T router01 mongosh -u ecommerce_user -p ecommerce123 --authenticationDatabase ecommerce

	$(MAKE) docker-create-indexes-and-shards

	docker compose exec seeder python /scripts/insert_customers.py
	docker compose exec seeder python /scripts/insert_orders.py
	docker compose exec seeder python /scripts/insert_products.py