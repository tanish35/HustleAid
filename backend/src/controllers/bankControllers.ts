import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const BANK_API_URL = process.env.BANK_API_URL;
const SECRET_KEY = process.env.JWT_SECRET as string;
const TOKEN_EXPIRY = "2m";

function generateJWT() {
  return jwt.sign({ authorized: true }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export const getBankDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const panNo = req.params.panNo as string;
    console.log("PAN No.:", panNo);
    console.log("BANK_API_URL:", BANK_API_URL);

    if (!panNo) {
      res.status(400).json({ error: "PAN No. is required" });
      return;
    }

    const token = generateJWT();

    const response = await axios.get(`${BANK_API_URL}/user/${panNo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Response from bank API:", response.data);
    res.json(response.data);
  }
);

export const listUserInBank = async (
  name: string,
  email: string,
  pan: string
) => {
  const token = generateJWT();

  enum EmploymentType {
    EMPLOYED,
    UNEMPLOYED,
    BUSINESS,
  }

  const income = Math.floor(Math.random() * 1000000 + 1);

  try {
    const res = await axios.post(
      `${BANK_API_URL}/user`,
      {
        name,
        email,
        pan,
        employmentType: EmploymentType[Math.floor(Math.random() * 3)],
        income,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error) {
    console.error("Error listing user in bank:", error);
    return null;
  }
};
