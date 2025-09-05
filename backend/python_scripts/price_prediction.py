import pymongo
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json
from datetime import datetime

# MongoDB connection details
MONGODB_URI = "mongodb://localhost:27017"
DATABASE_NAME = "auctiondb"
AUCTION_COLLECTION = "auctions"
MODEL_FILE = "price_prediction_model.pkl"
ENCODER_FILE = "label_encoder.pkl"
SCALER_FILE = "scaler.pkl"

def connect_db():
    client = pymongo.MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    return db

def fetch_auction_data(db):
    collection = db[AUCTION_COLLECTION]
    # Only fetch completed auctions with bids
    cursor = collection.find({
        "status": {"$in": ["ended", "sold"]},
        "bids": {"$exists": True, "$ne": []}
    })
    data = list(cursor)
    return data

def preprocess_data(data):
    df = pd.DataFrame(data)
    # Filter out auctions without currentBid or with currentBid <= 0
    df = df[df['currentBid'] > 0]
    # Convert date fields
    df['startTime'] = pd.to_datetime(df['startTime'])
    df['endTime'] = pd.to_datetime(df['endTime'])
    # Calculate duration
    df['duration_days'] = (df['endTime'] - df['startTime']).dt.days
    # Extract year and month
    df['year'] = df['startTime'].dt.year
    df['month'] = df['startTime'].dt.month
    # Use currentBid as target price
    df['target_price'] = df['currentBid']
    return df

def prepare_features(df):
    # Select features for prediction
    features = ['startingBid', 'category', 'condition', 'duration_days', 'year', 'month', 'watchers']
    df_features = df[features].copy()
    # Encode categorical variables
    le_category = LabelEncoder()
    le_condition = LabelEncoder()
    df_features['category_encoded'] = le_category.fit_transform(df_features['category'])
    df_features['condition_encoded'] = le_condition.fit_transform(df_features['condition'])
    # Select numerical features for model
    numerical_features = ['startingBid', 'duration_days', 'year', 'month', 'watchers', 'category_encoded', 'condition_encoded']
    X = df_features[numerical_features]
    y = df['target_price']
    return X, y, le_category, le_condition

def train_model(X, y):
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    # Train model
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"Model Performance:")
    print(f"Mean Squared Error: {mse}")
    print(f"R-squared Score: {r2}")
    return model, scaler

def save_model(model, scaler, le_category, le_condition):
    joblib.dump(model, MODEL_FILE)
    joblib.dump(scaler, SCALER_FILE)
    joblib.dump(le_category, ENCODER_FILE + '_category')
    joblib.dump(le_condition, ENCODER_FILE + '_condition')
    print("Model and encoders saved.")

def load_model():
    try:
        model = joblib.load(MODEL_FILE)
        scaler = joblib.load(SCALER_FILE)
        le_category = joblib.load(ENCODER_FILE + '_category')
        le_condition = joblib.load(ENCODER_FILE + '_condition')
        return model, scaler, le_category, le_condition
    except FileNotFoundError:
        return None, None, None, None

def predict_price(starting_bid, category, condition, duration_days, watchers=0):
    model, scaler, le_category, le_condition = load_model()
    if model is None:
        return None
    # Encode categorical variables
    try:
        category_encoded = le_category.transform([category])[0]
        condition_encoded = le_condition.transform([condition])[0]
    except ValueError:
        return None  # Unknown category or condition
    # Prepare features
    year = datetime.now().year
    month = datetime.now().month
    features = np.array([[starting_bid, duration_days, year, month, watchers, category_encoded, condition_encoded]])
    features_scaled = scaler.transform(features)
    predicted_price = model.predict(features_scaled)[0]
    return max(predicted_price, starting_bid)  # Ensure predicted price is at least starting bid

def main():
    print("Connecting to MongoDB...")
    db = connect_db()
    print("Fetching auction data...")
    data = fetch_auction_data(db)
    if not data:
        print("No suitable auction data found for training.")
        return
    print(f"Fetched {len(data)} auction records.")
    df = preprocess_data(data)
    if df.empty:
        print("No valid data after preprocessing.")
        return
    X, y, le_category, le_condition = prepare_features(df)
    model, scaler = train_model(X, y)
    save_model(model, scaler, le_category, le_condition)
    print("Price prediction model trained and saved.")

if __name__ == "__main__":
    main()
