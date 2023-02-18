import express from 'express'
const router = express.Router()
import {
    authUser,
    registerUser,
    updateUserProfile,
    updateUser,
    getUsersAsSalesman,
    deleteUser,
    facebookLogin,
    getUserPages
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsersAsSalesman)
router.post('/login', authUser)
router.post('/fbLogin', facebookLogin)
router.route('/profile').put(protect, updateUserProfile)
router.route('/:userId/pages').get(protect, getUserPages)
router
    .route('/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser)

export default router
