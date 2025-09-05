import argparse
import sys
from price_prediction import predict_price

def main():
    parser = argparse.ArgumentParser(description="Predict auction price")
    parser.add_argument('--startingBid', type=float, required=True, help='Starting bid price')
    parser.add_argument('--category', type=str, required=True, help='Auction category')
    parser.add_argument('--condition', type=str, required=True, help='Item condition')
    parser.add_argument('--durationDays', type=int, required=True, help='Auction duration in days')
    parser.add_argument('--watchers', type=int, default=0, help='Number of watchers')

    args = parser.parse_args()

    predicted_price = predict_price(
        starting_bid=args.startingBid,
        category=args.category,
        condition=args.condition,
        duration_days=args.durationDays,
        watchers=args.watchers
    )

    if predicted_price is None:
        print('{"error": "Prediction failed or model not trained"}')
        sys.exit(1)

    print(f'{{"predicted_price": {predicted_price:.2f}}}')

if __name__ == "__main__":
    main()
