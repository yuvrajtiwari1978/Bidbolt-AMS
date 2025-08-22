import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AuctionItem, User, Transaction, PaymentMethod } from '../types';
import toast from 'react-hot-toast';
import { auctionAPI, userAPI } from '../services/api';

interface AppState {
  user?: User;
  watchlist: AuctionItem[];
  auctions: AuctionItem[];
  searchQuery: string;
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_AUCTIONS'; payload: AuctionItem[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_WATCHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string }
  | { type: 'UPDATE_WALLET_BALANCE'; payload: number }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'REMOVE_PAYMENT_METHOD'; payload: string };

const initialState: AppState = {
  user: undefined,
  watchlist: [],
  auctions: [],
  searchQuery: '',
  selectedCategory: '',
  loading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : undefined };
    case 'SET_AUCTIONS':
      return { ...state, auctions: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TO_WATCHLIST':
      return { ...state, watchlist: [...state.watchlist, state.auctions.find(a => a.id === action.payload)!] };
    case 'REMOVE_FROM_WATCHLIST':
      return { ...state, watchlist: state.watchlist.filter(a => a.id !== action.payload) };
    case 'UPDATE_WALLET_BALANCE':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          wallet: {
            ...state.user.wallet,
            balance: action.payload
          }
        } : undefined
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          wallet: {
            ...state.user.wallet,
            transactions: [action.payload, ...state.user.wallet.transactions]
          }
        } : undefined
      };
    case 'ADD_PAYMENT_METHOD':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          wallet: {
            ...state.user.wallet,
            paymentMethods: [...state.user.wallet.paymentMethods, action.payload]
          }
        } : undefined
      };
    case 'REMOVE_PAYMENT_METHOD':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          wallet: {
            ...state.user.wallet,
            paymentMethods: state.user.wallet.paymentMethods.filter(pm => pm.id !== action.payload)
          }
        } : undefined
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchAuctions = async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    sortBy?: string;
    search?: string;
  }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await auctionAPI.getActiveAuctions(params);
      dispatch({ type: 'SET_AUCTIONS', payload: response.data.data.auctions });
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      toast.error('Failed to fetch auctions');
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch auctions' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchUser = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: response.data.data });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  useEffect(() => {
    fetchAuctions();
    fetchUser();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
