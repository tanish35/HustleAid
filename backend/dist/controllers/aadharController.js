"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAadharAddress = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const server_1 = require("@google/generative-ai/server");
const generative_ai_1 = require("@google/generative-ai");
const secrets_1 = __importDefault(require("../secrets"));
const { GEMINI_API_KEY } = secrets_1.default;
if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}
const mediaPath = path_1.default.resolve(__dirname, "../../public/aadhar");
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, mediaPath);
        },
        filename: (req, file, cb) => {
            cb(null, "aadhar.jpg");
        },
    }),
});
exports.getAadharAddress = [
    upload.single("aadhar"),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        //   const filePath = path.join(mediaPath, "aadhar.jpg");
        const filePath = req.file.path;
        try {
            // Upload the file to Google AI
            const fileManager = new server_1.GoogleAIFileManager(GEMINI_API_KEY);
            console.log("Uploading Aadhar card image...");
            const uploadResult = yield fileManager.uploadFile(filePath, {
                mimeType: "image/jpeg",
                displayName: "aadhar.jpg",
            });
            // Process the image using Gemini AI
            const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            console.log("Processing Aadhar card image...");
            const result = yield model.generateContent([
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
            const aadharRecord = yield prisma_1.default.aadhar.create({
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
            fs_1.default.unlinkSync(filePath);
            // Send the address back to the client
            res.status(200).json({ address });
        }
        catch (error) {
            console.error("Error processing Aadhar card image:", error);
            res.status(500).json({ message: "Failed to process Aadhar card image" });
        }
        finally {
            // Ensure the file is deleted even if an error occurs
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
    })),
];
