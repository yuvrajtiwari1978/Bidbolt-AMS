import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isWinning: {
    type: Boolean,
    default: false
  }
});

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startingBid: {
    type: Number,
    required: true,
    min: 0
  },
  currentBid: {
    type: Number,
    default: function() {
      return this.startingBid;
    }
  },
  buyNowPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sports',
      'Books',
      'Collectibles',
      'Art',
      'Jewelry',
      'Toys',
      'Automotive',
      'Other'
    ]
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    type: String,
    required: true
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bids: [bidSchema],
  watchers: {
    type: Number,
    default: 0
  },
  bidCount: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'sold', 'cancelled'],
    default: 'active'
  },
  shipping: {
    cost: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      required: true
    },
    international: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
auctionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for time left
auctionSchema.virtual('timeLeft').get(function() {
  const now = new Date();
  const end = new Date(this.endTime);
  const diff = end - now;
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
});

// Ensure virtual fields are serialized
auctionSchema.set('toJSON', { virtuals: true });
auctionSchema.set('toObject', { virtuals: true });

const Auction = mongoose.model('Auction', auctionSchema);

export default Auction;
