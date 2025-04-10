const rateLimit = require('express-rate-limit');

const { rateLimit: rateLimitConfig } = require('../config/security');

const apiLimiter = rateLimit({
  ...rateLimitConfig,
  keyGenerator: (req) => {
    return req.apiKey?.id || req.ip;
  },
  message: {
    error: 'Too many requests, please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many authentication requests, please try again later.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};