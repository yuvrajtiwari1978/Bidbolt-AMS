import express from 'express';
import {
  getActiveAuctions,
  getAuctionById,
  getAuctionsByCategory,
  getFeaturedAuctions,
  getEndingSoonAuctions,
  getRelatedAuctions
} from '../controllers/publicAuctionController.js';

const router = express.Router();

// Public auction routes (no authentication required)
router.get('/', getActiveAuctions);
router.get('/featured', getFeaturedAuctions);
router.get('/ending-soon', getEndingSoonAuctions);
router.get('/category/:category', getAuctionsByCategory);
router.get('/related/:auctionId', getRelatedAuctions);
router.get('/:id', getAuctionById);

export default router;
