import { Router } from 'express'
import advanceResult from '../middlewares/advanceResult'
import {
    getMessages,
    createMessage,
    deleteMessage,
    uploadImage
} from '../controllers/chat_controller'
import { checkAuth } from '../middlewares/checkAuth'
import { upload } from "../utils/upload-config"
const router = Router()
router
    .route('/')
    .post(checkAuth, createMessage)
    .get(checkAuth, getMessages)
router.route("/upload").post(upload.single("image"), uploadImage)
router.route('/:id').delete(checkAuth, deleteMessage)

export default router
