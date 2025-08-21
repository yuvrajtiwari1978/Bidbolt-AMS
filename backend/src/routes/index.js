// Central export file for all routes
import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import apiRoutes from './api.js';

const router = express.Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/', apiRoutes);

export default router;
