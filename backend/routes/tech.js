import { Router } from 'express'
import {
  getTechStacks,
  createTechStack,
  updateTechStack,
  deleteTechStack,
} from '../controllers/techController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { upload, verifyImageMagic } from '../middleware/upload.js'

const router = Router()

// Public
router.get('/', getTechStacks)

// Admin — accept multipart upload (single image field "image") OR plain JSON
router.post('/', protect, restrictTo('admin'), upload.single('image'), verifyImageMagic, createTechStack)
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), verifyImageMagic, updateTechStack)
router.delete('/:id', protect, restrictTo('admin'), deleteTechStack)

export default router
