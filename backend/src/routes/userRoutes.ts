import express from "express";

import {
  register,
  login,
  verifyEmail,
  getMe,
  addWalletId,
  googleLogin,
  logout,
} from "../controllers/userController";
import checkAuth from "../middleware/checkAuth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.get("/me", checkAuth, getMe);
router.post("/updatewallet", checkAuth, addWalletId);
router.post("/google-login", googleLogin);
router.get("/logout",logout);

export default router;
