import express from "express";

import {
  getVendors,
  getVendorById,
  addApprovedVendor,
} from "../controllers/vendorController";
import checkAuth from "../middleware/checkAuth";
import { adminAuth } from "../middleware/adminAuth";

const router = express.Router();

router.get("/", getVendors);
router.get("/:walletAddress", getVendorById);
router.post("/add", checkAuth, adminAuth, addApprovedVendor);

export default router;
