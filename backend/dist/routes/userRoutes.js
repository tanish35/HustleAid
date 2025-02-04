"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const router = express_1.default.Router();
router.post("/register", userController_1.register);
router.post("/login", userController_1.login);
router.get("/verify-email/:token", userController_1.verifyEmail);
router.get("/me", checkAuth_1.default, userController_1.getMe);
router.post("/updatewallet", checkAuth_1.default, userController_1.addWalletId);
router.post("/google-login", userController_1.googleLogin);
exports.default = router;
