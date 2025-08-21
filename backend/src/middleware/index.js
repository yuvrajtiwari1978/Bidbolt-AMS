// Central export file for all middleware
import { errorHandler, asyncHandler, notFound } from './errorHandler.js';
import { validateRequest, userValidationSchema, authValidationSchema } from './validation.js';
import { authenticate, authorizeAdmin } from './auth.js';
import { rateLimiter, authRateLimiter, apiRateLimiter } from './rateLimiter.js';

// Export all middleware
export {
  errorHandler,
  asyncHandler,
  notFound,
  validateRequest,
  userValidationSchema,
  authValidationSchema,
  authenticate,
  authorizeAdmin,
  rateLimiter,
  authRateLimiter,
  apiRateLimiter
};

// Default export
export default {
  errorHandler,
  asyncHandler,
  notFound,
  validateRequest,
  userValidationSchema,
  authValidationSchema,
  authenticate,
  authorizeAdmin,
  rateLimiter,
  authRateLimiter,
  apiRateLimiter
};
