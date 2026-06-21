import { Router } from 'express'
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { upload, verifyImageMagic } from '../middleware/upload.js'

const router = Router()

// Public
router.get('/', getProjects)
router.get('/:id', getProject)

// Admin — accept multipart upload (single image field "image") OR plain JSON
router.post('/', protect, restrictTo('admin'), upload.single('image'), verifyImageMagic, createProject)
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), verifyImageMagic, updateProject)
router.delete('/:id', protect, restrictTo('admin'), deleteProject)

export default router
