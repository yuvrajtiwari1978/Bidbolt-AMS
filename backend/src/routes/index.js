// Central export file for all routes
import express from 'express';
import apiRoutes from './api.js';

const router = express.Router();

// Mount versioned API routes
router.use('/', apiRoutes);

export default router;
