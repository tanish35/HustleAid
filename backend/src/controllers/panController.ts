import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../lib/prisma";
import Tesseract from "tesseract.js";
import { listUserInBank } from "./bankControllers";

const mediaPath: string = path.resolve(__dirname, "../../public/pan");

export const createMediaDirectoryMiddleware = (
  req: any,
  res: any,
  next: any
) => {
  try {
    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath, { recursive: true });
      console.log(`Directory created successfully: ${mediaPath}`);
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
      cb(null, `pan_${timestamp}.jpg`);
    },
  }),
});

export const uploadPanMiddleware = [
  createMediaDirectoryMiddleware,
  upload.single("pan"),
];

export const getPanDetails = expressAsyncHandler(async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const user = req.user;

  try {
    console.log("Processing PAN card image...");
    const ocrResult = await Tesseract.recognize(
      path.join(mediaPath, fileName),
      "eng+hin"
    );

    const ocrText = ocrResult.data.text;
    console.log("OCR Text:", ocrText);

    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const panMatch = ocrText.match(panRegex);

    if (!panMatch) {
      return res.status(422).json({
        message: "Could not extract valid PAN number from image",
        ocrText,
      });
    }

    const panNumber = panMatch[0];
    console.log("Extracted PAN Number:", panNumber);

    const panRecord = await prisma.user.update({
      where: { userId: user.userId },
      data: { panNo: panNumber },
    });

    if (!panRecord) {
      return res.status(500).json({ message: "Failed to create PAN record" });
    }

    const listUser = await listUserInBank(user.name, user.email, panNumber);

    if (!listUser) {
      throw new Error("Failed to list user in bank");
    }

    return res.status(200).json({
      message: "PAN card verified successfully",
      panNumber,
      ocrText,
    });
  } catch (error) {
    console.error("Error processing PAN card:", error);
    throw error;
  } finally {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("Successfully deleted file:", filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  }
});
