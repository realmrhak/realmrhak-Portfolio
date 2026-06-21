import { Router } from 'express'
import {
  getComments,
  createComment,
  likeComment,
  togglePinComment,
  deleteComment,
} from '../controllers/commentController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { writeLimiter } from '../middleware/rateLimiter.js'
import { upload, verifyImageMagic } from '../middleware/upload.js'

const router = Router()

// Public
router.get('/', getComments)
router.post('/', writeLimiter, upload.single('image'), verifyImageMagic, createComment)
router.put('/:id/like', writeLimiter, likeComment)

// Admin
router.put('/:id/pin', protect, restrictTo('admin'), togglePinComment)
router.delete('/:id', protect, restrictTo('admin'), deleteComment)

export default router
