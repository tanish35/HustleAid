import expressAsyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import prisma from "../lib/prisma";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import secrets from "../secrets";

const { GEMINI_API_KEY } = secrets;

if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined in the environment variables."
  );
}

const mediaPath = path.resolve(__dirname, "../../public/aadhar");

export const getAadharAddress = expressAsyncHandler(
  async (req: any, res: any) => {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    //   const filePath = path.join(mediaPath, "aadhar.jpg");
    const filePath = req.file.path;

    try {
      // Upload the file to Google AI
      const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);
      console.log("Uploading Aadhar card image...");
      const uploadResult = await fileManager.uploadFile(filePath, {
        mimeType: "image/jpeg",
        displayName: "aadhar.jpg",
      });

      // Process the image using Gemini AI
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      console.log("Processing Aadhar card image...");
      const result = await model.generateContent([
        "Extract the address from the Aadhar card image and provide it as a plain text response.",
        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
          },
        },
      ]);

      const address = result.response.text();
      console.log("Extracted Address:", address);
      const aadharRecord = await prisma.aadhar.create({
        data: {
          address: address,
          userId: req.user.userId, //doubt
        },
      });
      if (!aadharRecord) {
        return res
          .status(500)
          .json({ message: "Failed to create Aadhar record" });
      }

      // Delete the uploaded file after processing
      fs.unlinkSync(filePath);

      // Send the address back to the client
      res.status(200).json({ address });
    } catch (error) {
      console.error("Error processing Aadhar card image:", error);
      res.status(500).json({ message: "Failed to process Aadhar card image" });
    } finally {
      // Ensure the file is deleted even if an error occurs
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
);
