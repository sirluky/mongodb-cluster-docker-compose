import csv
from pymongo import MongoClient
from pymongo.errors import BulkWriteError
from datetime import datetime
import time
from collections import defaultdict

# MongoDB connection details
mongo_uri = "mongodb://admin_lukas:123@router01:27017,router02:27017/"
db_name = "ecommerce"
collection_name = "orders"

# Validation schema for the collection
orders_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["order_status", "customer_id"],
        "properties": {
            "order_status": {"bsonType": "string"},
            "customer_id": {"bsonType": "string"},
            "order_purchase_timestamp": {"bsonType": ["date", "null"]},
            "order_approved_at": {"bsonType": ["date", "null"]},
            "order_delivered_carrier_date": {"bsonType": ["date", "null"]},
            "order_delivered_customer_date": {"bsonType": ["date", "null"]},
            "order_estimated_delivery_date": {"bsonType": ["date", "null"]},
            "items": {
                "bsonType": "array",
                "items": {
                    "bsonType": "object",
                    "required": ["product_id", "shipping_limit_date", "price", "freight_value"],
                    "properties": {
                        "product_id": {"bsonType": "string"},
                        "shipping_limit_date": {"bsonType": "date"},
                        "price": {"bsonType": ["double", "decimal"]},
                        "freight_value": {"bsonType": ["double", "decimal"]}
                    }
                }
            }
        }
    }
}

print(f"Connecting to MongoDB at {mongo_uri} ...")
start_time = time.time()
try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
    client.server_info()
    print("Connected to MongoDB.")
except Exception as e:
    print("Failed to connect to MongoDB:", e)
    exit(1)
print(f"Selecting database '{db_name}' and collection '{collection_name}' ...")
db = client[db_name]

# Create the collection with validation if it doesn't exist
if collection_name not in db.list_collection_names():
    print(f"Creating collection '{collection_name}' with validation schema ...")
    db.create_collection(collection_name, validator=orders_schema)
else:
    print(f"Updating validation schema for collection '{collection_name}' ...")
    db.command({
        "collMod": collection_name,
        "validator": orders_schema,
        "validationLevel": "moderate"
    })
collection = db[collection_name]


def parse_date(val):
    try:
        return datetime.strptime(val, "%Y-%m-%d %H:%M:%S")
    except Exception:
        return None

# Načtení order_items
print("Loading order items...")
order_items = defaultdict(list)
with open("../data/olist_order_items_dataset.csv", mode='r', encoding='utf-8') as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        item = {
            "product_id": row["product_id"].strip('"'),
            "shipping_limit_date": parse_date(row["shipping_limit_date"]),
            "price": float(row["price"]),
            "freight_value": float(row["freight_value"])
        }
        order_items[row["order_id"].strip('"')].append(item)

# Načtení a vložení orders s items
print("Loading and inserting orders with items...")
with open("../data/olist_orders_dataset.csv", mode='r', encoding='utf-8') as file:
    csv_reader = csv.DictReader(file)
    docs = []
    count = 0
    batch_size = 5000
    
    for row in csv_reader:
        order_id = row["order_id"].strip('"')
        doc = {
            "_id": order_id,
            "customer_id": row["customer_id"].strip('"'),
            "order_status": row["order_status"],
            "order_purchase_timestamp": parse_date(row["order_purchase_timestamp"]),
            "order_approved_at": parse_date(row["order_approved_at"]),
            "order_delivered_carrier_date": parse_date(row["order_delivered_carrier_date"]),
            "order_delivered_customer_date": parse_date(row["order_delivered_customer_date"]),
            "order_estimated_delivery_date": parse_date(row["order_estimated_delivery_date"]),
            "items": order_items[order_id]
        }
        docs.append(doc)
        count += 1
        
        if len(docs) >= batch_size:
            try:
                result = collection.insert_many(docs, ordered=False)
                print(f"Inserted {len(result.inserted_ids)} documents...")
                docs = []
            except BulkWriteError as bwe:
                print("Some documents failed validation:", bwe.details)
                docs = []
    
    # Insert remaining documents
    if docs:
        try:
            result = collection.insert_many(docs, ordered=False)
            print(f"Inserted {len(result.inserted_ids)} documents...")
        except BulkWriteError as bwe:
            print("Some documents failed validation:", bwe.details)

print(f"Processed total {count} orders.")

print("Done. Closing MongoDB connection.")
client.close()
print(f"Script finished in {time.time() - start_time:.2f} seconds.")
