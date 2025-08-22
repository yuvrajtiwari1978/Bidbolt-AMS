import express from 'express';
import {
  getWallet,
  depositFunds,
  withdrawFunds,
  getTransactions,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod
} from '../controllers/walletController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Wallet routes
router.get('/', getWallet);
router.post('/deposit', depositFunds);
router.post('/withdraw', withdrawFunds);
router.get('/transactions', getTransactions);

// Payment method routes
router.post('/payment-methods', addPaymentMethod);
router.delete('/payment-methods/:paymentMethodId', removePaymentMethod);
router.put('/payment-methods/default', setDefaultPaymentMethod);

export default router;
