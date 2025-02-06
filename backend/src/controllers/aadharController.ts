import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../lib/prisma";
import Tesseract from "tesseract.js";
import { generateAIResponse } from "./llm.controller";

const mediaPath: string = path.resolve(__dirname, "../../public/aadhar");

export const createMediaDirectoryMiddleware = (
  req: any,
  res: any,
  next: any
) => {
  try {
    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath, { recursive: true });
    }
    next();
  } catch (error) {
    console.error(`Error creating directory ${mediaPath}:`, error);
    res.status(500).json({ message: "Failed to create upload directory" });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, mediaPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      cb(null, `aadhar_${timestamp}.jpg`);
    },
  }),
});

export const getAadharDetails = [
  createMediaDirectoryMiddleware,
  upload.single("aadhar"),
  expressAsyncHandler(async (req: any, res: any) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;

    try {
      console.log("Processing Aadhar card back image...");
      const ocrResult = await Tesseract.recognize(
        path.join(mediaPath, fileName),
        "eng+hin"
      );

      const ocrText = ocrResult.data.text;
      console.log("OCR Text:", ocrText);

      // Extract Aadhar number
      const aadharMatch = ocrText.match(/[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}/);
      const aadharNo = aadharMatch ? aadharMatch[0].replace(/\s/g, "") : null;

      if (!aadharNo || aadharNo.length !== 12) {
        return res.status(400).json({
          message: "Invalid or missing Aadhar number in the image",
        });
      }

      // Extract address using AI
      const prompt = `Extract the complete address from this Aadhar card text. Return only the address, nothing else: ${ocrText}`;
      const address = await generateAIResponse(prompt);

      if (!address || address.trim().length === 0) {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error("Error cleaning up file:", error);
        }

        return res.status(400).json({
          success: false,
          message:
            "Could not extract address from the image. Please ensure the address is clearly visible in the image and try again.",
          aadharNo,
        });
      }

      console.log("Aadhar Number: ", aadharNo);
      console.log("Address :", address);

      const updatedUser = await prisma.user.update({
        where: {
          userId: req.user.userId,
        },
        data: {
          aadharNo,
          address,
        },
      });

      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Failed to update user record" });
      }

      res.status(200).json({
        success: true,
        aadharNo,
        address,
        message: "Aadhar information processed successfully",
      });
    } catch (error) {
      console.error("Error processing Aadhar card image:", error);
      res.status(500).json({
        message: "Failed to process Aadhar card image",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error("Error cleaning up file:", error);
      }
    }
  }),
];
