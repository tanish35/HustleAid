import express from "express";
import { uploadAadhar as upload } from "../middleware/multer";
import { getAadharAddress } from "../controllers/aadharController";

const router = express.Router();

// Route to handle Aadhar card upload and address extraction
router.post("/aadhar/upload", upload, getAadharAddress);

export default router;
