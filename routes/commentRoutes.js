import express from 'express'
const router = express.Router()

import {
    getUsers,
    addCustomer,
    getComments,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from '../controllers/commentController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, admin, addCustomer).get(protect, getComments)

router.route('/users').get(protect, getUsers)

router
    .route('/:id')
    .get(protect, getCustomerById)
    .put(protect, admin, updateCustomer)
    .delete(protect, admin, deleteCustomer)
export default router
