import express from 'express'
const router = express.Router()

import { getNewsData } from '../controllers/newsDataController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/:id').get(protect, getNewsData)

export default router
