import express from "express";
import { getBankDetails } from "../controllers/bankControllers";

const router = express.Router();

router.get("/bankDetails/:panNo", getBankDetails);

export default router;
