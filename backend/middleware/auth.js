import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Fail fast at module-load time if JWT_SECRET is missing — better than
// crashing on every authenticated request after deploy.
if (!process.env.JWT_SECRET) {
  console.error('\n[auth] FATAL: JWT_SECRET is not set in the environment.')
  console.error('[auth] Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"')
  console.error('[auth] Set it in backend/.env (local) or Render dashboard (production).\n')
  // Don't exit in test environments, but warn loudly
  if (process.env.NODE_ENV !== 'test') process.exit(1)
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_ALGORITHM = 'HS256'

/**
 * Verify JWT from the Authorization header.
 * Attaches the user document to req.user on success.
 */
export async function protect(req, res, next) {
  try {
    let token
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    // Explicitly pin the algorithm to prevent the alg=none attack vector.
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] })

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please log in again' })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized, invalid token' })
    }
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

/**
 * Restrict a route to a specific role.
 * Usage: router.delete('/:id', protect, restrictTo('admin'), handler)
 */
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' })
    }
    next()
  }
}
