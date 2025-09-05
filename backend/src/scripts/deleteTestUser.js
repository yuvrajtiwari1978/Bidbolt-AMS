import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const deleteTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auctionapp');
    console.log('Connected to MongoDB');

    const email = 'testuser@example.com';

    const result = await User.deleteOne({ $or: [{ email }, { username: 'testuser' }] });
    if (result.deletedCount === 1) {
      console.log('Test user deleted');
    } else {
      console.log('Test user not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error deleting test user:', error);
    process.exit(1);
  }
};

deleteTestUser();
