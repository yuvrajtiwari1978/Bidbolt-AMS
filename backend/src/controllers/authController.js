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
      return ApiResponse.unauthorized(res, 'Invalid admin credentials');
    }
    
    const token = generateToken('admin');
    ApiResponse.success(res, { token, email }, 'Admin login successful');
  } catch (error) {
    ApiResponse.serverError(res, error.message);
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return ApiResponse.unauthorized(res, 'Invalid credentials');
    }

    console.log('User found:', user.email);
    console.log('Stored password hash:', user.password);

    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return ApiResponse.unauthorized(res, 'Invalid credentials');
    }

    const token = generateToken(user._id);
    ApiResponse.success(res, { token, user: user.toJSON() }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    ApiResponse.serverError(res, error.message);
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
      return ApiResponse.conflict(res, 'User with this email or username already exists');
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
    ApiResponse.created(res, { token, user: user.toJSON() }, 'Registration successful');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return ApiResponse.validationError(res, errors);
    }
    ApiResponse.serverError(res, error.message);
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    ApiResponse.success(res, user, 'Current user retrieved successfully');
  } catch (error) {
    ApiResponse.serverError(res, error.message);
  }
};
