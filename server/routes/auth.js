import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import validator from 'validator';
import pg from 'pg';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  isRefreshTokenValid,
  logSecurityAudit,
  authenticateToken,
} from '../middleware/auth.js';
import { authRateLimit, refreshRateLimit } from '../middleware/rateLimiter.js';

const router = express.Router();
const { Pool } = pg;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'iconstore',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const SALT_ROUNDS = 12;

/**
 * Validate password strength
 */
const validatePassword = password => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

/**
 * Get client IP address
 */
const getClientIP = req => {
  return (
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  );
};

/**
 * Register new user
 * POST /auth/register
 */
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const ipAddress = getClientIP(req);
    const userAgent = req.get('User-Agent');

    // Input validation
    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Email, username, and password are required',
        details: {
          email: !email ? 'Email is required' : null,
          username: !username ? 'Username is required' : null,
          password: !password ? 'Password is required' : null,
        },
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Invalid email format',
        details: { email: 'Invalid email format' },
      });
    }

    // Validate username
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Username must be between 3 and 30 characters',
        details: { username: 'Username must be between 3 and 30 characters' },
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Username can only contain letters, numbers, and underscores',
        details: {
          username:
            'Username can only contain letters, numbers, and underscores',
        },
      });
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({
        error: 'validation_error',
        message: passwordError,
        details: { password: passwordError },
      });
    }

    // Check if email or username already exists
    const existingUser = await pool.query(
      'SELECT email, username FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      const existing = existingUser.rows[0];
      const details = {};

      if (existing.email === email.toLowerCase()) {
        details.email = 'Email is already registered';
      }
      if (existing.username === username.toLowerCase()) {
        details.username = 'Username is already taken';
      }

      return res.status(409).json({
        error: 'conflict',
        message: 'User already exists',
        details,
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const newUser = await pool.query(
      `INSERT INTO users (email, username, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, username, currency_balance, created_at`,
      [email.toLowerCase(), username, passwordHash]
    );

    const user = newUser.rows[0];

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Hash refresh token for storage
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store refresh token
    await storeRefreshToken(
      user.id,
      refreshTokenHash,
      expiresAt,
      ipAddress,
      userAgent
    );

    // Log successful registration
    await logSecurityAudit(user.id, 'registration', ipAddress, userAgent, {
      email: user.email,
      username: user.username,
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        currency_balance: user.currency_balance,
        created_at: user.created_at,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 900, // 15 minutes in seconds
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'internal_error',
      message: 'Registration failed',
    });
  }
});

/**
 * Login user
 * POST /auth/login
 */
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = getClientIP(req);
    const userAgent = req.get('User-Agent');

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Email and password are required',
      });
    }

    // Rate limiting is handled by authRateLimit middleware

    // Get user from database
    const userResult = await pool.query(
      'SELECT id, email, username, password_hash, currency_balance, is_active FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'invalid_credentials',
        message: 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: 'account_deactivated',
        message: 'Account has been deactivated',
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({
        error: 'invalid_credentials',
        message: 'Invalid email or password',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Hash refresh token for storage
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store refresh token
    await storeRefreshToken(
      user.id,
      refreshTokenHash,
      expiresAt,
      ipAddress,
      userAgent
    );

    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [
      user.id,
    ]);

    // Log successful login
    await logSecurityAudit(user.id, 'login', ipAddress, userAgent, {
      email: user.email,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        currency_balance: user.currency_balance,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 900, // 15 minutes in seconds
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'internal_error',
      message: 'Login failed',
    });
  }
});

/**
 * Refresh access token
 * POST /auth/refresh
 */
router.post('/refresh', refreshRateLimit, async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refresh_token);
    } catch {
      return res.status(401).json({
        error: 'invalid_token',
        message: 'Invalid or expired refresh token',
      });
    }

    // Hash token to check in database
    const tokenHash = crypto
      .createHash('sha256')
      .update(refresh_token)
      .digest('hex');

    // Check if refresh token exists and is valid
    const tokenData = await isRefreshTokenValid(tokenHash);
    if (!tokenData) {
      return res.status(401).json({
        error: 'invalid_token',
        message: 'Refresh token is invalid or expired',
      });
    }

    // Get user data
    const userResult = await pool.query(
      'SELECT id, email, username, currency_balance, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
      await revokeRefreshToken(tokenHash);
      return res.status(401).json({
        error: 'invalid_user',
        message: 'User not found or deactivated',
      });
    }

    const user = userResult.rows[0];

    // Generate new access token
    const accessToken = generateAccessToken(user.id);

    res.json({
      access_token: accessToken,
      expires_in: 900, // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'internal_error',
      message: 'Token refresh failed',
    });
  }
});

/**
 * Logout user (invalidate refresh token)
 * POST /auth/logout
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      const tokenHash = crypto
        .createHash('sha256')
        .update(refresh_token)
        .digest('hex');
      await revokeRefreshToken(tokenHash);
    }

    res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'internal_error',
      message: 'Logout failed',
    });
  }
});

/**
 * Logout from all devices (revoke all refresh tokens)
 * POST /auth/logout-all
 */
router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    await revokeAllUserTokens(req.user.id);

    res.json({
      message: 'Logged out from all devices successfully',
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      error: 'internal_error',
      message: 'Logout failed',
    });
  }
});

export default router;
