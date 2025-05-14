# Makefile for MongoDB Cluster Management

# Start all containers in detached mode
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

# Full initialization sequence
init:
	$(MAKE) docker-up; \
	sleep 5; \
	$(MAKE) docker-init-configserver; \
	sleep 5; \
	$(MAKE) docker-init-shard01; \
	sleep 5; \
	$(MAKE) docker-init-shard02; \
	sleep 5; \
	$(MAKE) docker-init-shard03; \
	sleep 5; \
	$(MAKE) docker-init-router; \
	sleep 5; \
	$(MAKE) docker-auth; \
	sleep 5; \
	$(MAKE) docker-create-indexes

# Initialize router
docker-init-router:
	docker compose exec router01 sh -c "mongosh < /scripts/init-router.js"

# Setup authentication
docker-auth:
	docker compose exec configsvr01 bash "/scripts/auth.js"
	docker compose exec shard01-a bash "/scripts/auth.js"
	docker compose exec shard02-a bash "/scripts/auth.js"
	docker compose exec shard03-a bash "/scripts/auth.js"

# Connect to MongoDB shell via router
docker-connect-router:
	docker compose exec router01 mongosh --port 27017 -u "lukas" --authenticationDatabase admin

# Clean up docker compose containers
docker-clean:
	docker compose down -v --rmi all --remove-orphans

# Remove all stopped containers
docker-rm:
	docker compose rm

# Insert data
docker-create-indexes:
	docker compose exec router01 sh -c "mongosh -u lukas -p 123 < /scripts/create-indexes.js"