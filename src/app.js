require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Initialize database (this will create tables if they don't exist)
require('./db/database');

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production (HTTPS)
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Routes
app.use('/', indexRoutes);
app.use('/', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send('페이지를 찾을 수 없습니다.');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('서버 오류가 발생했습니다.');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
