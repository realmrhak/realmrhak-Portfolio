import { Router } from 'express'
import { getStats } from '../controllers/dashboardController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = Router()

router.get('/stats', protect, restrictTo('admin'), getStats)

export default router
