import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import connectDB from './config/mongodb.js';
import { errorHandler, notFound } from './middleware/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);

// Enhanced health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: {
      status: dbStatus,
      type: 'MongoDB',
      connected: mongoose.connection.readyState === 1
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Global error handler for uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Connect to MongoDB and start server
connectDB().then(() => {
  // Start server only after successful DB connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 API docs: http://localhost:${PORT}/api/v1`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server due to database connection issues:', error.message);
  process.exit(1);
});

export default app;
