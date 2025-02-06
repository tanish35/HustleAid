import {Router} from "express";
import {  getAadharDetails } from "../controllers/aadharController";
import {
  getPanDetails,
  createMediaDirectoryMiddleware,
  uploadPanMiddleware,
} from "../controllers/panController";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.post("/aadhar", checkAuth, getAadharDetails);
router.post(
  "/pan",
  checkAuth,
  createMediaDirectoryMiddleware,
  getPanDetails
);

export default router;
