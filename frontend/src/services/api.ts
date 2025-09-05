import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API calls
export const userAPI = {
  // Get all users
  getAllUsers: () => api.get('/users'),

  // Get user by ID
  getUserById: (id: string) => api.get(`/users/${id}`),

  // Create new user
  createUser: (userData: Record<string, unknown>) => api.post('/users', userData),

  // Update user
  updateUser: (id: string, userData: Record<string, unknown>) => api.put(`/users/${id}`, userData),

  // Delete user
  deleteUser: (id: string) => api.delete(`/users/${id}`),

  // Get current user profile
  getCurrentUser: () => api.get('/users/profile'),
};

// Auth API calls
export const authAPI = {
  // Register new user
  register: (userData: Record<string, unknown>) => api.post('/auth/register', userData),

  // Login user
  login: (credentials: Record<string, unknown>) => api.post('/auth/login', credentials),

  // Logout user
  logout: () => api.post('/auth/logout'),
};

// Auction API calls
export const auctionAPI = {
  // Get all active auctions with filtering and pagination
  getActiveAuctions: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    sortBy?: string;
    search?: string;
  }) => api.get('/auctions', { params }),

  // Get single auction details
  getAuctionById: (id: string) => api.get(`/auctions/${id}`),

  // Get featured auctions
  getFeaturedAuctions: () => api.get('/auctions/featured'),

  // Get auctions ending soon
  getEndingSoonAuctions: () => api.get('/auctions/ending-soon'),

  // Get auctions by category
  getAuctionsByCategory: (category: string, params?: { page?: number; limit?: number }) =>
    api.get(`/auctions/category/${category}`, { params }),

  // Get related auctions
  getRelatedAuctions: (auctionId: string) => api.get(`/auctions/related/${auctionId}`),
};

// Wallet API calls
export const walletAPI = {
  // Get wallet details
  getWallet: () => api.get('/wallet'),

  // Deposit funds
  depositFunds: (amount: number, paymentMethodId?: string) =>
    api.post('/wallet/deposit', { amount, paymentMethodId }),

  // Withdraw funds
  withdrawFunds: (amount: number, paymentMethodId?: string) =>
    api.post('/wallet/withdraw', { amount, paymentMethodId }),

  // Get transaction history
  getTransactions: (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => api.get('/wallet/transactions', { params }),

  // Add payment method
  addPaymentMethod: (paymentMethod: {
    type: string;
    last4: string;
    brand?: string;
  }) => api.post('/wallet/payment-methods', paymentMethod),

  // Remove payment method
  removePaymentMethod: (paymentMethodId: string) =>
    api.delete(`/wallet/payment-methods/${paymentMethodId}`),

  // Set default payment method
  setDefaultPaymentMethod: (paymentMethodId: string) =>
    api.put('/wallet/payment-methods/default', { paymentMethodId }),

  // Wallet balance visualization
  walletVisualization: (transactions: any[]) =>
    api.post('/python/wallet-visualization', { transactions }),
};

export default api;
