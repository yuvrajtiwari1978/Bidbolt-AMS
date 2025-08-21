import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const authorizeAdmin = async (req, res, next) => {
  if (req.user.email !== 'yuvrajtiwari1978@gmail.com') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};
