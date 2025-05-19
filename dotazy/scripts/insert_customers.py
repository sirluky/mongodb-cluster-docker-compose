import csv
from pymongo import MongoClient
from pymongo.errors import BulkWriteError
import time

# MongoDB connection details
mongo_uri = "mongodb://admin_lukas:123@router01:27017,router02:27017/"
db_name = "ecommerce"
collection_name = "customers"

# Validation schema for the collection
customers_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["customer_id", "customer_city", "customer_state", "customer_unique_id"],
        "properties": {
            "customer_id": {"bsonType": "string"},
            "customer_unique_id": {"bsonType": "string"},
            "customer_city": {"bsonType": "string"},
            "customer_state": {"bsonType": "string"},
            "customer_zip_code_prefix": {"bsonType": ["string", "null"]}
        }
    }
}

print(f"Connecting to MongoDB at {mongo_uri} ...")
start_time = time.time()
try:
    client = MongoClient(mongo_uri)
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
    db.create_collection(collection_name, validator=customers_schema)
else:
    print(f"Updating validation schema for collection '{collection_name}' ...")
    db.command({
        "collMod": collection_name,
        "validator": customers_schema,
        "validationLevel": "moderate"
    })
collection = db[collection_name]

# Path to the CSV file
csv_file_path = "../data/olist_customers_dataset.csv"
print(f"Reading data from {csv_file_path} ...")

def parse_row(row):
    return {
        "_id": row["customer_id"].strip('"'),
        "customer_id": row["customer_id"].strip('"'),
        "customer_unique_id": row["customer_unique_id"].strip('"'),
        "customer_city": row["customer_city"],
        "customer_state": row["customer_state"],
        "customer_zip_code_prefix": row["customer_zip_code_prefix"]
    }

# Read the CSV file and insert data into MongoDB
with open(csv_file_path, mode='r', encoding='utf-8') as file:
    csv_reader = csv.DictReader(file)
    docs = []
    count = 0
    batch_size = 5000  # Zvětšená velikost dávky pro lepší výkon
    
    for row in csv_reader:
        docs.append(parse_row(row))
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

print(f"Processed total {count} rows.")
print("Done. Closing MongoDB connection.")
client.close()
print(f"Script finished in {time.time() - start_time:.2f} seconds.") 