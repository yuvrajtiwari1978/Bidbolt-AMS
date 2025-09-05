// Simple rate limiting middleware
const requests = new Map();

export const rateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    validRequests.push(now);
    requests.set(key, validRequests);
    
    next();
  };
};

// Stricter rate limit for authentication endpoints
export const authRateLimiter = rateLimiter(15 * 60 * 1000, 20); // Increased to 20 requests per 15 minutes for testing

// General rate limit for API endpoints
export const apiRateLimiter = rateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, times] of requests.entries()) {
    const validTimes = times.filter(time => now - time < 15 * 60 * 1000);
    if (validTimes.length === 0) {
      requests.delete(key);
    } else {
      requests.set(key, validTimes);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export default {
  rateLimiter,
  authRateLimiter,
  apiRateLimiter
};
