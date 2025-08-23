# Auction Platform Documentation

## Introduction
A modern, full-stack auction platform built with React and Node.js, featuring real-time bidding, user authentication, and a responsive design.

## Frontend Documentation
### Structure
The frontend is built using **React** with **TypeScript** and utilizes **Vite** as the build tool.

### Key Components
- **App Component**: Manages routing and context.
- **Layout Component**: Contains the header, categories dropdown, and bottom navigation.
- **Home Page**: Displays active auctions, statistics, and featured auctions.

### Button Functionalities
- **Start Bidding**: Navigates to the auction creation page.
- **Explore Auctions**: Navigates to the auction exploration page.
- **Place Bid**: Navigates to the auction detail page for bidding.
- **Add to Watchlist**: Adds/removes auctions from the user's watchlist.

### Styling and Build Process
The application uses **Tailwind CSS** for styling and is built using **Vite**, which provides fast development and build times.

## Backend Documentation
### Overview
The backend is built using **Express.js**, providing a RESTful API for the application. It connects to a **MongoDB** database using **Mongoose**.

### API Endpoints
- **Authentication**
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `POST /api/auth/logout` - User logout
- **Auctions**
  - `GET /api/auctions` - Get all auctions
  - `GET /api/auctions/:id` - Get specific auction
  - `POST /api/auctions` - Create new auction
  - `PUT /api/auctions/:id` - Update auction
  - `DELETE /api/auctions/:id` - Delete auction

### Middleware and Security Features
- **CORS**: Configured to allow requests from specific origins.
- **Helmet**: Enhances security by setting various HTTP headers.
- **Morgan**: Logs HTTP requests for monitoring.

## Database Schema
### User Model
- **username**: Unique username for the user.
- **email**: Unique email address for the user.
- **password**: Hashed password for authentication.
- **wallet**: Contains balance, pending balance, and transaction history.

### Auction Model
- **title**: Title of the auction.
- **description**: Description of the auction item.
- **startingBid**: Initial bid amount.
- **bids**: Array of bids placed on the auction.

## Deployment Instructions
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and update it with your MongoDB connection string.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Testing
### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
