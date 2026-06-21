import { Router } from 'express'
import {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import { upload, verifyImageMagic } from '../middleware/upload.js'

const router = Router()

// Public
router.get('/', getCertificates)
router.get('/:id', getCertificate)

// Admin — accept multipart upload (single image field "image") OR plain JSON
router.post('/', protect, restrictTo('admin'), upload.single('image'), verifyImageMagic, createCertificate)
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), verifyImageMagic, updateCertificate)
router.delete('/:id', protect, restrictTo('admin'), deleteCertificate)

export default router
