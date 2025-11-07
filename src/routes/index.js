const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

/**
 * GET /
 * Landing page
 */
router.get('/', (req, res) => {
  // Check if user is already logged in
  const isLoggedIn = req.session && req.session.userId;

  res.render('index', { isLoggedIn });
});

/**
 * GET /main
 * Protected main dashboard page
 */
router.get('/main', requireAuth, (req, res) => {
  res.render('main', {
    userEmail: req.session.userEmail
  });
});

module.exports = router;
