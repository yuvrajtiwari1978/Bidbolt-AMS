import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// Get wallet details
export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallet');
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }

    res.json(ApiResponse.success(user.wallet, 'Wallet retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Deposit funds
export const depositFunds = async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;

    if (!amount || amount <= 0) {
      return ApiResponse.badRequest(res, 'Invalid deposit amount');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    // Create transaction
    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'deposit',
      amount: amount,
      description: `Wallet deposit ${paymentMethodId ? `via ${paymentMethodId}` : 'via direct deposit'}`,
      timestamp: new Date(),
      status: 'completed'
    };

    // Update wallet
    user.wallet.balance += amount;
    user.wallet.transactions.unshift(transaction);

    await user.save();

    return ApiResponse.success(res, {
      balance: user.wallet.balance,
      transaction
    }, 'Funds deposited successfully');
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Withdraw funds
export const withdrawFunds = async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;
    
    if (!amount || amount <= 0) {
      return ApiResponse.badRequest(res, 'Invalid withdrawal amount');
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    if (user.wallet.balance < amount) {
      return ApiResponse.badRequest(res, 'Insufficient balance');
    }

    // Create transaction
    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'withdrawal',
      amount: -amount,
      description: `Withdrawal to ${paymentMethodId || 'bank account'}`,
      timestamp: new Date(),
      status: 'pending'
    };

    // Update wallet
    user.wallet.balance -= amount;
    user.wallet.transactions.unshift(transaction);
    
    await user.save();

    res.json(ApiResponse.success({
      balance: user.wallet.balance,
      transaction
    }, 'Withdrawal initiated successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Get transaction history
export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const user = await User.findById(req.user.id).select('wallet.transactions');
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }

    let transactions = user.wallet.transactions;
    
    // Filter by type if provided
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    res.json(ApiResponse.success({
      transactions: paginatedTransactions,
      total: transactions.length,
      page: parseInt(page),
      pages: Math.ceil(transactions.length / limit)
    }, 'Transactions retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Add payment method
export const addPaymentMethod = async (req, res) => {
  try {
    const { type, last4, brand } = req.body;
    
    if (!type || !last4) {
      return res.status(400).json(ApiResponse.error('Payment method details required'));
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }

    const paymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      last4,
      brand: brand || null,
      isDefault: user.wallet.paymentMethods.length === 0
    };

    user.wallet.paymentMethods.push(paymentMethod);
    
    await user.save();

    res.json(ApiResponse.success(paymentMethod, 'Payment method added successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Remove payment method
export const removePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }

    user.wallet.paymentMethods = user.wallet.paymentMethods.filter(
      pm => pm.id !== paymentMethodId
    );
    
    await user.save();

    res.json(ApiResponse.success(null, 'Payment method removed successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Set default payment method
export const setDefaultPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }

    // Reset all payment methods
    user.wallet.paymentMethods.forEach(pm => {
      pm.isDefault = pm.id === paymentMethodId;
    });
    
    await user.save();

    res.json(ApiResponse.success(null, 'Default payment method updated successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};
