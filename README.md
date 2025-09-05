# Auction Platform 🏛️

A modern, full-stack auction platform built with React and Node.js, featuring real-time bidding, user authentication, and a responsive design.

## 🚀 Features

- **Real-time Auctions**: Live bidding with instant updates
- **User Authentication**: Secure login/register system with JWT
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Auction Management**: Create, manage, and monitor auctions
- **Watchlist**: Save auctions to watch later
- **Notifications**: Real-time notifications for bids and auction updates
- **Wallet Integration**: Track your bidding history and balance
- **Admin Panel**: Comprehensive admin dashboard for platform management

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Rate Limiting** for security
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
auction-platform/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utility functions
│   └── package.json
├── docs/                   # Documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   # Option 1: Use the setup script (recommended)
   ../setup-env.bat  # Windows
   # or
   ../setup-env.sh   # Linux/Mac
   
   # Option 2: Manual setup
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string and other configurations

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Auctions
- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/:id` - Get specific auction
- `POST /api/auctions` - Create new auction
- `PUT /api/auctions/:id` - Update auction
- `DELETE /api/auctions/:id` - Delete auction

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/watchlist` - Get user's watchlist

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Environment variable configuration

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env.example)
1. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your MongoDB connection string and other configurations:
   ```
   MONGODB_URI=mongodb://localhost:27017/bidbolt
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### Frontend (.env.example)
1. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your API base URL and other configurations:
   ```
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_APP_NAME=BidBolt
   VITE_APP_VERSION=1.0.0
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, email support@auctionplatform.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Payment integration
- [ ] Real-time chat between buyers and sellers
- [ ] Advanced search and filtering
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

Built with ❤️ by the Auction Platform Team
