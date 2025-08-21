import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Auction from '../models/Auction.js';
import User from '../models/User.js';

dotenv.config();

const seedAuctions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auction-portal');
    console.log('Connected to MongoDB');

    // Clear existing auctions
    await Auction.deleteMany({});
    console.log('Cleared existing auctions');

    // Create sample users if they don't exist
    let sampleUser = await User.findOne({ email: 'seller@example.com' });
    if (!sampleUser) {
      sampleUser = new User({
        firstName: 'Sample',
        lastName: 'Seller',
        username: 'sample_seller',
        email: 'seller@example.com',
        password: 'password123', // In real app, this should be hashed
        avatar: 'https://via.placeholder.com/150',
        rating: 4.8
      });
      await sampleUser.save();
    }

    // Sample auction data
    const sampleAuctions = [
      {
        title: 'iPhone 14 Pro Max - 256GB',
        description: 'Brand new iPhone 14 Pro Max in excellent condition. Comes with original box and accessories. Unlocked for all carriers.',
        startingBid: 50000,
        currentBid: 50000,
        buyNowPrice: 75000,
        category: 'Electronics',
        condition: 'New',
        images: ['https://via.placeholder.com/400x300?text=iPhone+14+Pro'],
        seller: sampleUser._id,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        shipping: {
          cost: 500,
          location: 'Mumbai, India',
          international: true
        }
      },
      {
        title: 'Vintage Rolex Submariner Watch',
        description: 'Authentic vintage Rolex Submariner from 1985. Recently serviced and in excellent working condition. Comes with original box and papers.',
        startingBid: 150000,
        currentBid: 150000,
        buyNowPrice: 250000,
        category: 'Jewelry',
        condition: 'Good',
        images: ['https://via.placeholder.com/400x300?text=Rolex+Submariner'],
        seller: sampleUser._id,
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        shipping: {
          cost: 1000,
          location: 'Delhi, India',
          international: false
        }
      },
      {
        title: 'MacBook Pro 16" M2 Pro - 512GB',
        description: 'MacBook Pro 16-inch with M2 Pro chip. 16GB RAM, 512GB SSD. Perfect condition, barely used. Includes original charger and box.',
        startingBid: 120000,
        currentBid: 120000,
        buyNowPrice: 180000,
        category: 'Electronics',
        condition: 'Like New',
        images: ['https://via.placeholder.com/400x300?text=MacBook+Pro+16'],
        seller: sampleUser._id,
        endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        shipping: {
          cost: 800,
          location: 'Bangalore, India',
          international: true
        }
      },
      {
        title: 'Nike Air Jordan 1 Retro High OG',
        description: 'Limited edition Nike Air Jordan 1 Retro High OG. Size 10 US. Deadstock condition, never worn. Comes with original box.',
        startingBid: 8000,
        currentBid: 8000,
        buyNowPrice: 15000,
        category: 'Fashion',
        condition: 'New',
        images: ['https://via.placeholder.com/400x300?text=Air+Jordan+1'],
        seller: sampleUser._id,
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        shipping: {
          cost: 300,
          location: 'Chennai, India',
          international: false
        }
      },
      {
        title: 'Sony PlayStation 5 Console',
        description: 'PlayStation 5 console with one controller. Used for 3 months, perfect condition. Includes original box and cables.',
        startingBid: 35000,
        currentBid: 35000,
        buyNowPrice: 45000,
        category: 'Electronics',
        condition: 'Like New',
        images: ['https://via.placeholder.com/400x300?text=PlayStation+5'],
        seller: sampleUser._id,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        shipping: {
          cost: 600,
          location: 'Hyderabad, India',
          international: true
        }
      },
      {
        title: 'Louis Vuitton Neverfull MM Bag',
        description: 'Authentic Louis Vuitton Neverfull MM tote bag. Monogram canvas with leather trim. Used but in excellent condition.',
        startingBid: 25000,
        currentBid: 25000,
        buyNowPrice: 40000,
        category: 'Fashion',
        condition: 'Good',
        images: ['https://via.placeholder.com/400x300?text=LV+Neverfull'],
        seller: sampleUser._id,
        endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        shipping: {
          cost: 400,
          location: 'Kolkata, India',
          international: false
        }
      }
    ];

    // Insert sample auctions
    const createdAuctions = await Auction.insertMany(sampleAuctions);
    console.log(`Created ${createdAuctions.length} sample auctions`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding auctions:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAuctions();
