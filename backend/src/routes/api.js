import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import auctionRoutes from './auctionRoutes.js';
import walletRoutes from './walletRoutes.js';
import pythonRoutes from './pythonRoutes.js';

const router = express.Router();

router.use('/v1/users', userRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/auctions', auctionRoutes);
router.use('/v1/wallet', walletRoutes);
router.use('/v1/python', pythonRoutes);

router.get('/v1', (req, res) => {
  res.json({
    success: true,
    message: 'API v1 is running',
    endpoints: {
      users: {
        'GET /api/v1/users': 'Get all users',
        'GET /api/v1/users/:id': 'Get user by ID',
        'POST /api/v1/users': 'Create new user (admin only)',
        'PUT /api/v1/users/:id': 'Update user (admin only)',
        'DELETE /api/v1/users/:id': 'Delete user (admin only)',
        'GET /api/v1/users/profile': 'Get current user profile'
      },
      auth: {
        'POST /api/v1/auth/register': 'Register new user',
        'POST /api/v1/auth/login': 'Login user',
        'POST /api/v1/auth/logout': 'Logout user',
        'GET /api/v1/auth/me': 'Get current user info'
      },
      auctions: {
        'GET /api/v1/auctions': 'Get all active auctions with filtering and pagination',
        'GET /api/v1/auctions/featured': 'Get featured auctions',
        'GET /api/v1/auctions/ending-soon': 'Get auctions ending within 24 hours',
        'GET /api/v1/auctions/category/:category': 'Get auctions by category',
        'GET /api/v1/auctions/related/:auctionId': 'Get related auctions',
        'GET /api/v1/auctions/:id': 'Get single auction details'
      },
      python: {
        'POST /api/v1/python/predict-price': 'Predict auction price using ML model',
        'GET /api/v1/python/analyze-data': 'Run data analysis on auction data',
        'POST /api/v1/python/train-model': 'Train the price prediction model'
      }
    }
  });
});

export default router;
