import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    ApiResponse.success(res, users, 'Users retrieved successfully');
  } catch (error) {
    ApiResponse.error(res, error.message);
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }
    
    ApiResponse.success(res, user, 'User retrieved successfully');
  } catch (error) {
    ApiResponse.error(res, error.message);
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return ApiResponse.error(res, 'User with this email or username already exists', 400);
    }
    
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName
    });
    
    await user.save();
    
    const userResponse = user.toJSON();
    ApiResponse.created(res, userResponse, 'User created successfully');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return ApiResponse.validationError(res, errors.join(', '));
    }
    ApiResponse.error(res, error.message);
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }
    
    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'password' && user[key] !== undefined) {
        user[key] = updateData[key];
      }
    });
    
    // Update password if provided
    if (password) {
      user.password = password;
    }
    
    await user.save();
    
    ApiResponse.success(res, user, 'User updated successfully');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return ApiResponse.validationError(res, errors.join(', '));
    }
    ApiResponse.error(res, error.message);
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }
    
    ApiResponse.success(res, null, 'User deleted successfully');
  } catch (error) {
    ApiResponse.error(res, error.message);
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }
    
    ApiResponse.success(res, user, 'Current user retrieved successfully');
  } catch (error) {
    ApiResponse.error(res, error.message);
  }
};
