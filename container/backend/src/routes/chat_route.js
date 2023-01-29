import { Router } from "express";
import advanceResult from "../middlewares/advanceResult";
import {
  getMessages,
  createMessage,
  deleteMessage,
  uploadImage,
} from "../controllers/chat_controller";
import { checkAuth } from "../middlewares/checkAuth";
import { upload } from "../utils/upload-config";

import { v2 as cloudinary } from "cloudinary";
import ErrorResponse from "../utils/ErrorResponse";

const router = Router();
router.route("/").post(checkAuth, createMessage).get(checkAuth, getMessages);
router
  .route("/upload")
  // upload.single("image"), uploadImage,
  .post(async (req, res, next) => {
    try {
      const file = req.files.image;
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      res.json({
        succes: true,
        data: { url: result.url, id: result.public_id },
      });
    } catch (e) {
      console.log(e);
      return next(new ErrorResponse(e.message, e.http_code));
    }
  });
router.route("/:id").delete(checkAuth, deleteMessage);

export default router;
