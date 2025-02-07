import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import expressAsyncHandler from "express-async-handler";

const BANK_API_URL = process.env.BANK_API_URL;
const SECRET_KEY = process.env.JWT_SECRET as string;
const TOKEN_EXPIRY = "2m";

function generateJWT() {
  return jwt.sign({ authorized: true }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export const getBankDetails = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const panNo = req.params.panNo as string;
    if (!panNo) {
      res.status(400).json({ error: "PAN No. is required" });
      return;
    }

    const token = generateJWT();

    try {
      const response = await axios.get(`${BANK_API_URL}/${panNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);
      res.json("data fetched");
    } catch (error) {
      console.error("Error fetching bank details:", error);
      res.status(500).json({ error: "Failed to fetch bank details" });
    }
  }
);

export const lsitUserInBank = expressAsyncHandler(
  (req: Request, res: Response): void => {
    const token = generateJWT();
    res.json({ token });
  }
);
