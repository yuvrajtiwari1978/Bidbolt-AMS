import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validateRequest, authValidationSchema } from '../middleware/validation.js';

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authRateLimiter);

// Public routes with validation
router.post('/register', validateRequest(authValidationSchema.register), register);
router.post('/login', validateRequest(authValidationSchema.login), login);

// Protected route
router.get('/me', getCurrentUser);

export default router;
