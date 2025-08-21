import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(ApiResponse.success(users, 'Users retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }
    
    res.json(ApiResponse.success(user, 'User retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
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
    
    const userResponse = user.toJSON();
    res.status(201).json(ApiResponse.success(userResponse, 'User created successfully'));
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(ApiResponse.error(errors.join(', ')));
    }
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
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
    
    res.json(ApiResponse.success(user, 'User updated successfully'));
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(ApiResponse.error(errors.join(', ')));
    }
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }
    
    res.json(ApiResponse.success(null, 'User deleted successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json(ApiResponse.error('User not found'));
    }
    
    res.json(ApiResponse.success(user, 'Current user retrieved successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};
