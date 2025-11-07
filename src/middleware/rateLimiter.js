const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for login attempts
 * Limits to 5 requests per minute per IP
 */
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).render('login', {
      error: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
      email: req.body.email || ''
    });
  }
});

/**
 * Rate limiter for signup attempts
 * Limits to 3 requests per 15 minutes per IP
 */
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: '회원가입 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).render('signup', {
      error: '회원가입 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
      email: req.body.email || ''
    });
  }
});

module.exports = {
  loginLimiter,
  signupLimiter
};
