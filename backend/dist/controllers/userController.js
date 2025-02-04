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
exports.getMe = exports.addWalletId = exports.logout = exports.googleLogin = exports.login = exports.verifyEmail = exports.register = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendMail_1 = __importDefault(require("../mail/sendMail"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, walletId } = req.body;
    const userExists = yield prisma_1.default.user.findUnique({ where: { email } });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const user = yield prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            walletId,
        },
    });
    const verificationToken = jsonwebtoken_1.default.sign({ userId: user.userId }, JWT_SECRET, {
        expiresIn: "1d",
    });
    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;
    const htmlContent = `
      <h1>Welcome to Hustle Aid, ${user.name}!</h1>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;
    (0, sendMail_1.default)(htmlContent, user.email, "Verify Your Email - Hustle Aid");
    res.status(201).json({
        userId: user.userId,
        name: user.name,
        email: user.email,
        walletId: user.walletId,
    });
}));
exports.verifyEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        yield prisma_1.default.user.update({
            where: { userId: decoded.userId },
            data: {
                isVerified: true,
            },
        });
        res.json({ message: "Email verified" });
    }
    catch (error) {
        res.status(401);
        throw new Error("Invalid or expired token");
    }
}));
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma_1.default.user.findUnique({ where: { email } });
    if (!(user === null || user === void 0 ? void 0 : user.password)) {
        res.status(401).json({
            error: "You have logged in with Google. Please use Google Sign-In",
        });
        return;
    }
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        if (user.isVerified === false) {
            res.status(401);
            throw new Error("Email not verified");
        }
        const exp = Date.now() + 1000 + 60 * 60 * 24 * 30;
        const token = jsonwebtoken_1.default.sign({ sub: user.userId, exp }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });
        res.json({
            userId: user.userId,
            name: user.name,
            email: user.email,
            walletId: user.walletId,
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
}));
exports.googleLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        let user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            user = yield prisma_1.default.user.create({
                data: {
                    name,
                    email,
                    isVerified: true,
                },
            });
        }
        const exp = Date.now() + 1000 + 60 * 60 * 24 * 30;
        const token = jsonwebtoken_1.default.sign({ sub: user.userId, exp }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });
        res.json({
            userId: user.userId,
            name: user.name,
            email: user.email,
            walletId: user.walletId,
        });
    }
    catch (error) {
        res.status(401);
        throw new Error("Invalid Google token");
    }
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
}));
exports.addWalletId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.body;
    const user = yield prisma_1.default.user.update({
        // @ts-ignore
        where: { userId: req.user.userId },
        data: {
            walletId: walletAddress,
        },
    });
    res.json({
        userId: user.userId,
        name: user.name,
        email: user.email,
        walletId: user.walletId,
    });
}));
exports.getMe = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        // @ts-ignore
        where: { userId: req.user.userId },
    });
    if ((user === null || user === void 0 ? void 0 : user.isVerified) === false) {
        res.status(401);
        throw new Error("Email not verified");
    }
    if (user) {
        res.json({
            userId: user.userId,
            name: user.name,
            email: user.email,
            walletId: user.walletId,
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
}));
