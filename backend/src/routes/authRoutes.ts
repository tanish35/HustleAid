import { Router } from "express";
import authControllers from "../controllers/authControllers";
const router = Router();

router.post("/login", authControllers.login);
router.post("/register", authControllers.register);
router.post("/logout", authControllers.logout);
router.get("/refresh-token", authControllers.refreshToken);

export default router;
