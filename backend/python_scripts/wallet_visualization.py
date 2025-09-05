import matplotlib.pyplot as plt
import pandas as pd
import json
import base64
import io
import sys
from datetime import datetime

def create_wallet_balance_graph(transactions_data):
    """
    Create a line graph showing wallet balance over time based on transactions
    """
    if not transactions_data:
        # Create empty graph if no transactions
        plt.figure(figsize=(10, 6))
        plt.title('Wallet Balance Over Time')
        plt.xlabel('Date')
        plt.ylabel('Balance (₹)')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
    else:
        # Parse transactions
        transactions = []
        for txn in transactions_data:
            transactions.append({
                'timestamp': datetime.fromisoformat(txn['timestamp'].replace('Z', '+00:00')),
                'amount': txn['amount'],
                'type': txn['type'],
                'description': txn['description']
            })

        # Sort transactions by timestamp
        transactions.sort(key=lambda x: x['timestamp'])

        # Calculate balance over time
        balance = 0
        balances = []
        timestamps = []
        transaction_points = []

        for txn in transactions:
            balance += txn['amount']
            balances.append(balance)
            timestamps.append(txn['timestamp'])
            transaction_points.append({
                'timestamp': txn['timestamp'],
                'balance': balance,
                'type': txn['type'],
                'amount': txn['amount']
            })

        # Create the plot
        plt.figure(figsize=(12, 6))

        # Plot the balance line
        plt.plot(timestamps, balances, 'b-', linewidth=2, alpha=0.8)

        # Add markers for transactions
        for point in transaction_points:
            if point['type'] == 'deposit':
                plt.plot(point['timestamp'], point['balance'], 'go', markersize=6, alpha=0.7)  # Green for deposits
            elif point['type'] == 'withdrawal':
                plt.plot(point['timestamp'], point['balance'], 'ro', markersize=6, alpha=0.7)  # Red for withdrawals
            else:
                plt.plot(point['timestamp'], point['balance'], 'bo', markersize=4, alpha=0.5)  # Blue for others

        # Customize the plot
        plt.title('Wallet Balance Over Time', fontsize=16, fontweight='bold')
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Balance (₹)', fontsize=12)
        plt.grid(True, alpha=0.3)

        # Format x-axis dates
        plt.gcf().autofmt_xdate()

        # Add current balance annotation
        if balances:
            current_balance = balances[-1]
            plt.annotate('.2f',
                        xy=(timestamps[-1], current_balance),
                        xytext=(10, 10), textcoords='offset points',
                        bbox=dict(boxstyle='round,pad=0.3', facecolor='yellow', alpha=0.8),
                        fontsize=10, fontweight='bold')

        plt.tight_layout()

    # Convert plot to base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()

    return image_base64

def main():
    try:
        # Read transactions data from stdin (passed from Node.js)
        input_data = sys.stdin.read()
        if input_data.strip():
            transactions_data = json.loads(input_data)
        else:
            transactions_data = []

        # Generate the graph
        graph_base64 = create_wallet_balance_graph(transactions_data)

        # Output the result as JSON
        result = {
            'success': True,
            'graph_base64': graph_base64
        }

        print(json.dumps(result))

    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
