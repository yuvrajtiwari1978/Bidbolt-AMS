import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authRateLimiter);

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/me', getCurrentUser);

export default router;
