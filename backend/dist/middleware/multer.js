"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAadhar = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
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
exports.uploadAadhar = upload.single("aadhar");
