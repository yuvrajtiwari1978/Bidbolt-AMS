import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auctionapp');
    console.log('Connected to MongoDB');

    const email = 'testuser@example.com';
    const password = 'testpassword';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Test user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: password, // Store plain password, let pre-save hook hash it
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      wallet: {
        balance: 1000,
        transactions: [],
        paymentMethods: []
      }
    });

    await user.save();
    console.log('Test user created');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding test user:', error);
    process.exit(1);
  }
};

seedTestUser();
