import pymongo
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
from datetime import datetime

# MongoDB connection details - update as needed or load from environment variables
MONGODB_URI = "mongodb://localhost:27017"
DATABASE_NAME = "auctiondb"
AUCTION_COLLECTION = "auctions"

def connect_db():
    client = pymongo.MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    return db

def fetch_auction_data(db):
    collection = db[AUCTION_COLLECTION]
    cursor = collection.find({})
    data = list(cursor)
    return data

def preprocess_data(data):
    # Convert to DataFrame
    df = pd.DataFrame(data)
    # Convert date fields to datetime
    df['startTime'] = pd.to_datetime(df['startTime'])
    df['endTime'] = pd.to_datetime(df['endTime'])
    df['createdAt'] = pd.to_datetime(df['createdAt'])
    df['updatedAt'] = pd.to_datetime(df['updatedAt'])
    # Extract additional features
    df['duration_days'] = (df['endTime'] - df['startTime']).dt.days
    df['year'] = df['startTime'].dt.year
    return df

def generate_reports(df):
    # Sales trends by year
    sales_by_year = df.groupby('year').size()
    print("Sales by Year:")
    print(sales_by_year)

    # Category distribution
    category_counts = df['category'].value_counts()
    print("\nCategory Distribution:")
    print(category_counts)

    # Average starting bid by category
    avg_starting_bid = df.groupby('category')['startingBid'].mean()
    print("\nAverage Starting Bid by Category:")
    print(avg_starting_bid)

    # Plot sales trends
    plt.figure(figsize=(10,6))
    sales_by_year.plot(kind='bar')
    plt.title('Number of Auctions by Year')
    plt.xlabel('Year')
    plt.ylabel('Number of Auctions')
    plt.tight_layout()
    plt.savefig('auction_sales_by_year.png')
    plt.close()

    # Plot category distribution
    plt.figure(figsize=(10,6))
    category_counts.plot(kind='bar')
    plt.title('Auction Category Distribution')
    plt.xlabel('Category')
    plt.ylabel('Count')
    plt.tight_layout()
    plt.savefig('auction_category_distribution.png')
    plt.close()

def main():
    print("Connecting to MongoDB...")
    db = connect_db()
    print("Fetching auction data...")
    data = fetch_auction_data(db)
    if not data:
        print("No auction data found.")
        return
    print(f"Fetched {len(data)} auction records.")
    df = preprocess_data(data)
    generate_reports(df)
    print("Reports generated and saved as PNG files.")

if __name__ == "__main__":
    main()
