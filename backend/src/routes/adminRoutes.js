import express from 'express';
import {
  deleteAuction,
  cancelBidding,
  scheduleAuction,
  closeAuction,
  getAuctionSchedule,
  getAuctionDetails,
  getAuctionAnalytics
} from '../controllers/auctionController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.post('/auctions', authenticate, authorizeAdmin, scheduleAuction);
router.delete('/auctions/:id', authenticate, authorizeAdmin, deleteAuction);
router.put('/auctions/:id/cancel', authenticate, authorizeAdmin, cancelBidding);
router.put('/auctions/:id/close', authenticate, authorizeAdmin, closeAuction);
router.get('/auctions/schedule', getAuctionSchedule);
router.get('/auctions/:id', getAuctionDetails);
router.get('/auctions/analytics', getAuctionAnalytics);

export default router;
