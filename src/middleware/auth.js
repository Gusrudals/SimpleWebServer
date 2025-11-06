/**
 * Authentication middleware to protect routes
 * Checks if user is authenticated via session
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated, redirect to login
    res.redirect('/login');
  }
}

/**
 * Redirect authenticated users away from auth pages
 * (e.g., if already logged in, don't show login/signup pages)
 */
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.userId) {
    // User is already authenticated, redirect to main page
    res.redirect('/main');
  } else {
    // User is not authenticated, continue
    next();
  }
}

module.exports = {
  requireAuth,
  redirectIfAuth
};
