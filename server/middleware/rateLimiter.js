import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints
 * More restrictive limits for login/register to prevent abuse
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'rate_limited',
    message: 'Too many authentication attempts',
    retry_after: 900, // 15 minutes
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate limiter for token refresh endpoint
 * More lenient than auth but still protected
 */
export const refreshRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 refresh requests per windowMs
  message: {
    error: 'rate_limited',
    message: 'Too many token refresh attempts',
    retry_after: 900,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiter
 * For protected routes that require authentication
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'rate_limited',
    message: 'Too many API requests',
    retry_after: 900,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for sensitive operations
 * For password changes, account deletion, etc.
 */
export const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per hour
  message: {
    error: 'rate_limited',
    message: 'Too many sensitive operation attempts',
    retry_after: 3600, // 1 hour
  },
  standardHeaders: true,
  legacyHeaders: false,
});
