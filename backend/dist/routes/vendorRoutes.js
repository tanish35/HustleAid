"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendorController_1 = require("../controllers/vendorController");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const adminAuth_1 = require("../middleware/adminAuth");
const router = express_1.default.Router();
router.get("/", vendorController_1.getVendors);
router.get("/:walletAddress", vendorController_1.getVendorById);
router.post("/add", checkAuth_1.default, adminAuth_1.adminAuth, vendorController_1.addApprovedVendor);
exports.default = router;
