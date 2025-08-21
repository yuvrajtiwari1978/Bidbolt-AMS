import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/ApiResponse.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email !== 'yuvrajtiwari1978@gmail.com' || password !== '88888888') {
      return res.status(401).json(ApiResponse.error('Invalid admin credentials'));
    }
    
    const token = generateToken('admin');
    res.json(ApiResponse.success({ token, email }, 'Admin login successful'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(ApiResponse.error('Invalid credentials'));
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(ApiResponse.error('Invalid credentials'));
    }
    
    const token = generateToken(user._id);
    res.json(ApiResponse.success({ token, user: user.toJSON() }, 'Login successful'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// User registration
export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json(
        ApiResponse.error('User with this email or username already exists')
      );
    }
    
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName
    });
    
    await user.save();
    
    const token = generateToken(user._id);
    res.status(201).json(ApiResponse.success({ token, user: user.toJSON() }, 'Registration successful'));
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(ApiResponse.error(errors.join(', ')));
    }
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(ApiResponse.success(user, 'Current user retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};