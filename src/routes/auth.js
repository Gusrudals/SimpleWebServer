const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { signupValidation, loginValidation, checkValidation } = require('../middleware/validation');
const { loginLimiter, signupLimiter } = require('../middleware/rateLimiter');
const { redirectIfAuth } = require('../middleware/auth');

/**
 * GET /signup
 * Render signup page
 */
router.get('/signup', redirectIfAuth, (req, res) => {
  res.render('signup', { error: null, email: '' });
});

/**
 * POST /signup
 * Handle signup form submission
 */
router.post('/signup',
  signupLimiter,
  signupValidation,
  checkValidation,
  async (req, res) => {
    const { email, password } = req.body;

    // Check for validation errors
    if (req.validationErrors && req.validationErrors.length > 0) {
      return res.render('signup', {
        error: req.validationErrors[0],
        email: email || ''
      });
    }

    try {
      // Create user
      const user = await userService.createUser(email, password);

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;

      // Redirect to main page
      res.redirect('/main');
    } catch (error) {
      console.error('Signup error:', error);

      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      if (error.message === 'Email already exists') {
        errorMessage = '이미 등록된 이메일입니다.';
      }

      res.render('signup', {
        error: errorMessage,
        email: email
      });
    }
  }
);

/**
 * GET /login
 * Render login page
 */
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('login', { error: null, email: '' });
});

/**
 * POST /login
 * Handle login form submission
 */
router.post('/login',
  loginLimiter,
  loginValidation,
  checkValidation,
  async (req, res) => {
    const { email, password } = req.body;

    // Check for validation errors
    if (req.validationErrors && req.validationErrors.length > 0) {
      return res.render('login', {
        error: req.validationErrors[0],
        email: email || ''
      });
    }

    try {
      // Verify credentials
      const user = await userService.verifyCredentials(email, password);

      if (!user) {
        // Use generalized error message for security
        return res.render('login', {
          error: '이메일 또는 비밀번호가 올바르지 않습니다.',
          email: email
        });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;

      // Redirect to main page
      res.redirect('/main');
    } catch (error) {
      console.error('Login error:', error);

      res.render('login', {
        error: '로그인 중 오류가 발생했습니다.',
        email: email
      });
    }
  }
);

/**
 * POST /logout
 * Handle logout
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
