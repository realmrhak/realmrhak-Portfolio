import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_ALGORITHM = 'HS256'

if (!JWT_SECRET) {
  console.error('\n[authController] FATAL: JWT_SECRET is not set.')
  if (process.env.NODE_ENV !== 'test') process.exit(1)
}

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: JWT_ALGORITHM,
  })
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password')

    // Use identical responses for "no user" and "wrong password" to prevent user enumeration
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user)

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}
