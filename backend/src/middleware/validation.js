// Request validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body);
    
    if (result.error) {
      const errorMessage = result.error.details ? 
        result.error.details.map(detail => detail.message).join(', ') : 
        result.error;
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
    
    next();
  };
};

// Validation schemas
export const userValidationSchema = {
  create: {
    validate: (data) => {
      const errors = [];
      
      if (!data.username || typeof data.username !== 'string') {
        errors.push('Username is required and must be a string');
      }
      
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Valid email is required');
      }
      
      if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
      
      return { error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null };
    }
  },
  
  update: {
    validate: (data) => {
      const errors = [];
      
      if (data.username && typeof data.username !== 'string') {
        errors.push('Username must be a string');
      }
      
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Valid email is required');
      }
      
      if (data.password && data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
      
      return { error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null };
    }
  }
};

// Authentication validation
export const authValidationSchema = {
  register: {
    validate: (data) => {
      const errors = [];
      
      if (!data.username || typeof data.username !== 'string' || data.username.length < 3) {
        errors.push('Username is required and must be at least 3 characters');
      }
      
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Valid email is required');
      }
      
      if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
      
      return { error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null };
    }
  },
  
  login: {
    validate: (data) => {
      const errors = [];
      
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Valid email is required');
      }
      
      if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
      
      return { error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null };
    }
  }
};

export default {
  validateRequest,
  userValidationSchema,
  authValidationSchema
};
