import express from "express";
import { getBankDetails } from "../controllers/bankControllers";

const router = express.Router();

router.get("/:panNo", getBankDetails);

export default router;
