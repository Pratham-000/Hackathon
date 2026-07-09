const rateLimit = require('express-rate-limit');

const baseConfig = {
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
};

const apiLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 300,
});

const authLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

const aiLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'AI request limit exceeded. Please try again later.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter,
};