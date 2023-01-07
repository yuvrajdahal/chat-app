import { Router } from 'express'
import advanceResult from '../middlewares/advanceResult'
import User from '../models/user_model'
import {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} from '../controllers/users_controller'
import { checkAuth, authorize } from '../middlewares/checkAuth'

const router = Router()

router
  .route('/')
  .get(checkAuth, advanceResult(User), getUsers)
  .put(checkAuth, updateUser)

router.route('/:id').get(checkAuth, getUser).delete(checkAuth, deleteUser)

export default router
