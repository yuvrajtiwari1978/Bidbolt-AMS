# Backend API

This is the backend server for the website, built with Node.js and Express.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Start the production server:
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
- **GET** `/api/health` - Returns server status

### Data Routes
- **GET** `/api/data` - Returns sample data

## Project Structure
```
backend/
├── src/
│   └── server.js          # Main server file
├── .env                   # Environment variables
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
