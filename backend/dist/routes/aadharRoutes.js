"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { uploadAadhar as upload } from "../middleware/multer";
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const aadharController_1 = require("../controllers/aadharController");
const router = express_1.default.Router();
// Route to handle Aadhar card upload and address extraction
router.post("/upload", verifyJWT_1.default, aadharController_1.getAadharAddress);
exports.default = router;
