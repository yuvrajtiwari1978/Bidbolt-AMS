import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser
} from '../controllers/userController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllUsers);

// Protected routes (authentication required)
router.get('/profile', authenticate, getCurrentUser);
router.get('/:id', authenticate, getUserById);

// Admin only routes
router.post('/', authorizeAdmin, createUser);
router.put('/:id', authorizeAdmin, updateUser);
router.delete('/:id', authorizeAdmin, deleteUser);

export default router;
