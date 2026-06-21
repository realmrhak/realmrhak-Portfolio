import { Router } from 'express'
import { login, me } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/login', authLimiter, login)
router.get('/me', protect, me)

export default router
