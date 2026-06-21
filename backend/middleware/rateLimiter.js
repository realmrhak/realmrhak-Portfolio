import rateLimit from 'express-rate-limit'

/**
 * Generic limiter — 100 req / 15 min per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' },
})

/**
 * Stricter limiter for auth routes — 10 attempts / 15 min.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
})

/**
 * Limiter for public write actions (comments, messages) — 20 / hour.
 * Prevents spam while letting real users interact.
 */
export const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions from this IP, please try again later.' },
})
