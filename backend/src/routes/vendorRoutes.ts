import express from "express";

import {
  getVendors,
  getVendorById,
  addApprovedVendor,
} from "../controllers/vendorController";

const router = express.Router();

router.get("/", getVendors);
router.get("/:walletAddress", getVendorById);
router.post("/add", addApprovedVendor);

export default router;
