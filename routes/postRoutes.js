import express from 'express'
const router = express.Router()

import { getPerformance } from '../controllers/postController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { getCompetitor } from '../controllers/competitorController.js'

router.route('/performance/:id').get(protect, getPerformance)
router.route('/competitor/:id').get(protect, getCompetitor)

export default router
