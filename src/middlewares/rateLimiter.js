const rateLimit = require('express-rate-limit');

// rate limiter for general api access 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  skip: () => process.env.NODE_ENV === 'test',
});

// stricter limit for auth endpoints like login and register 
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  skip: () => process.env.NODE_ENV === 'test',
});

module.exports = {
  apiLimiter,
  authLimiter,
};
