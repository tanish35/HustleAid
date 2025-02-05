import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../lib/prisma";
import Tesseract from "tesseract.js";

const mediaPath: string = path.resolve(__dirname, "../../public/aadhar");

export const createMediaDirectoryMiddleware = (req: any, res: any, next: any) => {
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

export const getAadharAddress = [
  createMediaDirectoryMiddleware,
  upload.single("aadhar"),
  expressAsyncHandler(async (req: any, res: any) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;

    try {
      console.log("Processing Aadhar card image...");
      const ocrResult = await Tesseract.recognize(
        path.join(mediaPath, fileName),
        "eng+hin"
      );

      const ocrText = ocrResult.data.text;
      console.log("OCR Text:", ocrText);

      // Extract Aadhar number
      const aadharMatch = ocrText.match(/\d{4}\s\d{4}\s\d{4}/);
      const aadharNo = aadharMatch ? aadharMatch[0].replace(/\s/g, '') : null;
      console.log("Extracted Aadhar number:", aadharNo);
      
      if (!aadharNo) {
        return res.status(400).json({ 
          message: "Could not extract Aadhar number from the image" 
        });
      }

      const updatedUser = await prisma.user.update({
        where: {
          userId: req.user.userId
        },
        data: {
          aadharNo: aadharNo,
        },
      });

      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user record" });
      }

      res.status(200).json({ 
        aadharNo,
        message: "Aadhar number extracted and updated successfully" 
      });
    } catch (error) {
      console.error("Error processing Aadhar card image:", error);
      res.status(500).json({ 
        message: "Failed to process Aadhar card image",
        error: error instanceof Error ? error.message : 'Unknown error'
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
