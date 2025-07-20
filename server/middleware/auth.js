import jwt from 'jsonwebtoken';
import pg from 'pg';

const { Pool } = pg;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'iconstore',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  'your-super-secret-refresh-key-change-in-production';

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Access token required',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database to ensure they still exist and are active
    const userResult = await pool.query(
      'SELECT id, email, username, currency_balance, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'User not found',
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Account is deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'token_expired',
        message: 'Access token has expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'invalid_token',
        message: 'Invalid access token',
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'internal_error',
      message: 'Authentication error',
    });
  }
};

/**
 * Generate access token (short-lived)
 */
export const generateAccessToken = userId => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
};

/**
 * Generate refresh token (long-lived)
 */
export const generateRefreshToken = userId => {
  return jwt.sign({ userId, type: 'refresh' }, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = token => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw error;
  }
};

/**
 * Store refresh token in database
 */
export const storeRefreshToken = async (
  userId,
  tokenHash,
  expiresAt,
  ipAddress,
  userAgent
) => {
  try {
    const result = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, tokenHash, expiresAt, ipAddress, userAgent]
    );
    return result.rows[0].id;
  } catch (error) {
    throw new Error('Failed to store refresh token: ' + error.message);
  }
};

/**
 * Revoke refresh token
 */
export const revokeRefreshToken = async tokenHash => {
  try {
    await pool.query(
      'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token_hash = $1',
      [tokenHash]
    );
  } catch (error) {
    throw new Error('Failed to revoke refresh token: ' + error.message);
  }
};

/**
 * Revoke all refresh tokens for a user
 */
export const revokeAllUserTokens = async userId => {
  try {
    await pool.query(
      'UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = $1',
      [userId]
    );
  } catch (error) {
    throw new Error('Failed to revoke user tokens: ' + error.message);
  }
};

/**
 * Check if refresh token exists and is valid
 */
export const isRefreshTokenValid = async tokenHash => {
  try {
    const result = await pool.query(
      `SELECT user_id FROM refresh_tokens 
       WHERE token_hash = $1 AND is_revoked = FALSE AND expires_at > NOW()`,
      [tokenHash]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new Error('Failed to validate refresh token: ' + error.message);
  }
};

/**
 * Log security audit event (only for successful critical events)
 */
export const logSecurityAudit = async (userId, eventType, ipAddress, userAgent, metadata = {}) => {
  try {
    await pool.query(
      `INSERT INTO security_audit (user_id, event_type, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, eventType, ipAddress, userAgent, JSON.stringify(metadata)]
    );
  } catch (error) {
    console.error('Failed to log security audit:', error);
  }
};

// Failed login attempts are now handled by express-rate-limit middleware
// No need for database tracking of failed attempts
