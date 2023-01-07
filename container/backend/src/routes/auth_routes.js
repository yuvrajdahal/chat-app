import express from "express";
import {
  getCurrentUser,
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/auth_controller";
import { checkAuth } from "../middlewares/checkAuth";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/current_user").get(checkAuth, getCurrentUser);
router.route("/forgot_password").post(forgotPassword);
router.route("/reset_password/:token").post(resetPassword);
router.route("/verify_email").get(verifyEmail);

export default router;
