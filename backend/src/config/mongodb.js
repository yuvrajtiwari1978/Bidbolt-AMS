import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auctionapp';
    
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.log('💡 Please ensure:');
    console.log('   1. MongoDB is running on your system');
    console.log('   2. The MONGODB_URI in .env file is correct');
    console.log('   3. MongoDB is accessible from your network');
    
    // Graceful shutdown with retry suggestion
    console.log('\n🔄 Retrying connection in 5 seconds...');
    setTimeout(() => {
      console.log('🔄 Attempting to reconnect to MongoDB...');
      connectDB();
    }, 5000);
  }
};

export default connectDB;
