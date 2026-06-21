import { Router } from 'express'
import {
  createMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
} from '../controllers/messageController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { writeLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Public
router.post('/', writeLimiter, createMessage)

// Admin
router.get('/', protect, restrictTo('admin'), getMessages)
router.put('/:id/read', protect, restrictTo('admin'), markMessageRead)
router.delete('/:id', protect, restrictTo('admin'), deleteMessage)

export default router
