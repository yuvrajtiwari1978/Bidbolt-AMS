export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice?: number;
  timeLeft: string;
  endTime: Date;
  image: string;
  watchers: number;
  bidCount: number;
  category: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    avatar: string;
  };
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  shipping: {
    cost: number;
    location: string;
    international: boolean;
  };
  bids: Bid[];
  status: 'active' | 'ended' | 'sold';
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  joinDate: Date;
  watchlist: string[];
  bidHistory: Bid[];
  notifications: Notification[];
  wallet: Wallet;
  sellingItems: string[];
  purchasedItems: string[];
  address?: Address;
}

export interface Wallet {
  balance: number;
  pendingBalance: number;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bid' | 'refund' | 'payment' | 'earning';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  relatedAuctionId?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  type: 'bid_outbid' | 'auction_ending' | 'auction_won' | 'auction_lost' | 'payment_received' | 'withdrawal_completed';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  subcategories?: Category[];
}

export interface Order {
  id: string;
  auctionId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed';
  createdAt: Date;
  shippingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  auctionId?: string;
}