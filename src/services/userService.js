const bcrypt = require('bcrypt');
const db = require('../db/database');

const SALT_ROUNDS = 10;

class UserService {
  /**
   * Create a new user with hashed password
   * @param {string} email - User's email
   * @param {string} password - User's plain text password
   * @returns {Object} - Created user object (without password)
   * @throws {Error} - If email already exists or database error
   */
  async createUser(email, password) {
    try {
      // Hash the password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Insert user into database
      const stmt = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
      `);

      const result = stmt.run(email, passwordHash);

      // Return created user without password
      return {
        id: result.lastInsertRowid,
        email: email,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Verify user credentials
   * @param {string} email - User's email
   * @param {string} password - User's plain text password
   * @returns {Object|null} - User object (without password) if valid, null otherwise
   */
  async verifyCredentials(email, password) {
    try {
      // Find user by email
      const stmt = db.prepare(`
        SELECT id, email, password_hash, created_at
        FROM users
        WHERE email = ?
      `);

      const user = stmt.get(email);

      if (!user) {
        return null;
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
        return null;
      }

      // Return user without password hash
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      };
    } catch (error) {
      console.error('Error verifying credentials:', error);
      return null;
    }
  }

  /**
   * Find user by ID
   * @param {number} userId - User's ID
   * @returns {Object|null} - User object (without password) if found, null otherwise
   */
  findById(userId) {
    try {
      const stmt = db.prepare(`
        SELECT id, email, created_at
        FROM users
        WHERE id = ?
      `);

      return stmt.get(userId);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {boolean} - True if email exists, false otherwise
   */
  emailExists(email) {
    try {
      const stmt = db.prepare(`
        SELECT COUNT(*) as count
        FROM users
        WHERE email = ?
      `);

      const result = stmt.get(email);
      return result.count > 0;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  }
}

module.exports = new UserService();
