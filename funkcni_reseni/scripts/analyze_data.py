import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pymongo import MongoClient
import json
from datetime import datetime

# Připojení k MongoDB
client = MongoClient('mongodb://localhost:27117')
db = client['olist_db']

def analyze_collection(collection_name):
    collection = db[collection_name]
    
    # Základní statistiky
    total_docs = collection.count_documents({})
    print(f"\nAnalýza kolekce: {collection_name}")
    print(f"Celkový počet dokumentů: {total_docs}")
    
    # Získání vzorku dokumentu pro analýzu struktury
    sample_doc = collection.find_one()
    if sample_doc:
        print("\nStruktura dokumentu:")
        for key, value in sample_doc.items():
            if key != '_id':
                print(f"- {key}: {type(value).__name__}")
    
    # Analýza prázdných hodnot
    empty_fields = {}
    for key in sample_doc.keys():
        if key != '_id':
            empty_count = collection.count_documents({key: None})
            empty_fields[key] = empty_count
    
    print("\nPočet prázdných hodnot v jednotlivých polích:")
    for field, count in empty_fields.items():
        print(f"- {field}: {count} ({count/total_docs*100:.2f}%)")

def analyze_orders():
    orders = db.orders
    order_items = db.order_items
    
    # Analýza objednávek
    analyze_collection('orders')
    
    # Analýza položek objednávek
    analyze_collection('order_items')
    
    # Agregace pro analýzu hodnot objednávek
    pipeline = [
        {
            '$lookup': {
                'from': 'order_items',
                'localField': 'order_id',
                'foreignField': 'order_id',
                'as': 'items'
            }
        },
        {
            '$project': {
                'order_id': 1,
                'total_value': {'$sum': '$items.price'},
                'items_count': {'$size': '$items'}
            }
        }
    ]
    
    results = list(orders.aggregate(pipeline))
    
    # Statistiky hodnot objednávek
    total_values = [r['total_value'] for r in results]
    items_counts = [r['items_count'] for r in results]
    
    print("\nStatistiky hodnot objednávek:")
    print(f"Průměrná hodnota objednávky: {np.mean(total_values):.2f}")
    print(f"Medián hodnoty objednávky: {np.median(total_values):.2f}")
    print(f"Minimální hodnota objednávky: {min(total_values):.2f}")
    print(f"Maximální hodnota objednávky: {max(total_values):.2f}")
    
    # Vytvoření grafů
    plt.figure(figsize=(12, 6))
    
    plt.subplot(1, 2, 1)
    sns.histplot(total_values, bins=50)
    plt.title('Rozdělení hodnot objednávek')
    plt.xlabel('Hodnota objednávky')
    plt.ylabel('Počet objednávek')
    
    plt.subplot(1, 2, 2)
    sns.histplot(items_counts, bins=50)
    plt.title('Rozdělení počtu položek v objednávkách')
    plt.xlabel('Počet položek')
    plt.ylabel('Počet objednávek')
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    analyze_orders() 