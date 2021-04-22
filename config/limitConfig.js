module.exports = {
  rateLimitConfig: {
    windowMs: 60 * 1000,
    max: 300,
    message: { message: 'Too many requests, please try again later.' },
  },
  slowDownConfig: {
    windowMs: 10 * 1000,
    delayAfter: 100,
    delayMs: 100,
  },
};
