# Auction Data Fetching Setup Guide

This guide explains how to set up and use the auction data fetching system for your frontend portal.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/auction-portal
PORT=5000
```

### 3. Seed Sample Data
Run the seeder to populate initial auction data:
```bash
node src/scripts/seedAuctions.js
```

### 4. Start the Backend Server
```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the Frontend Development Server
```bash
npm run dev
```

## API Endpoints

### Public Auction Endpoints

#### Get All Active Auctions
- **Endpoint**: `GET /api/v1/auctions`
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 20)
  - `category` (string): Filter by category
  - `minPrice` (number): Minimum price filter
  - `maxPrice` (number): Maximum price filter
  - `condition` (string): Filter by condition (New, Like New, Good, Fair, Poor)
  - `sortBy` (string): Sort by (ending_soon, price_low, price_high, most_watched, most_bids, newest)
  - `search` (string): Search in title and description

#### Get Featured Auctions
- **Endpoint**: `GET /api/v1/auctions/featured`
- **Description**: Returns popular auctions with high engagement

#### Get Auctions Ending Soon
- **Endpoint**: `GET /api/v1/auctions/ending-soon`
- **Description**: Returns auctions ending within 24 hours

#### Get Auctions by Category
- **Endpoint**: `GET /api/v1/auctions/category/:category`
- **Parameters**: Category name in URL

#### Get Single Auction Details
- **Endpoint**: `GET /api/v1/auctions/:id`
- **Parameters**: Auction ID in URL

#### Get Related Auctions
- **Endpoint**: `GET /api/v1/auctions/related/:auctionId`
- **Description**: Returns related auctions in the same category

## Frontend Integration

### Using the Auction API in Components

```typescript
import { auctionAPI } from '../services/api';

// Fetch all auctions
const auctions = await auctionAPI.getActiveAuctions({
  category: 'Electronics',
  sortBy: 'ending_soon',
  limit: 10
});

// Fetch single auction
const auction = await auctionAPI.getAuctionById('auction-id-here');

// Fetch featured auctions
const featured = await auctionAPI.getFeaturedAuctions();
```

### Using the App Context

The AppContext now automatically fetches auction data on mount:

```typescript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { state, dispatch } = useApp();
  const { auctions, loading, error } = state;

  // Auctions are automatically loaded
  // Use dispatch to update filters
  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };
}
```

## Data Structure

### Auction Item
```typescript
interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice?: number;
  timeLeft: string;
  endTime: Date;
  image: string;
  watchers: number;
  bidCount: number;
  category: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    avatar: string;
  };
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  shipping: {
    cost: number;
    location: string;
    international: boolean;
  };
  bids: Bid[];
  status: 'active' | 'ended' | 'sold';
}
```

## Testing the Setup

1. Start both backend and frontend servers
2. Visit `http://localhost:5173` (or your frontend URL)
3. Navigate to the Explore page to see auction listings
4. Use filters to test search and filtering functionality
5. Click on individual auctions to view details

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend has CORS configured
2. **Database Connection**: Check MongoDB is running and accessible
3. **Port Conflicts**: Ensure ports 5000 (backend) and 5173 (frontend) are available
4. **Missing Data**: Run the seeder script to populate sample auctions

### Debug Commands

```bash
# Check backend is running
curl http://localhost:5000/api/v1

# Check auctions endpoint
curl http://localhost:5000/api/v1/auctions

# Check specific auction
curl http://localhost:5000/api/v1/auctions/[auction-id]
```

## Next Steps

1. Add user authentication to enable bidding
2. Implement real-time bidding updates
3. Add auction creation functionality
4. Implement payment processing
5. Add auction management for sellers
