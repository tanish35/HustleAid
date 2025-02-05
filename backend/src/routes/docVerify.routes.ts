import express from "express";
import { getAadharAddress } from "../controllers/aadharController";
import {
  getPanDetails,
  createMediaDirectoryMiddleware,
  uploadPanMiddleware,
} from "../controllers/panController";
import checkAuth from "../middleware/checkAuth";

const router = express.Router();

router.post("/adhar", checkAuth, getAadharAddress);
router.post(
  "/pan",
  checkAuth,
  createMediaDirectoryMiddleware,
  uploadPanMiddleware,
  getPanDetails
);

export default router;
