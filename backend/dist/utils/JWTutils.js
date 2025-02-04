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
exports.generateAccessToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const secrets_1 = __importDefault(require("../secrets"));
const { JWT_SECRET, JWT_REFRESH_TOKEN_SECRET } = secrets_1.default;
if (!JWT_SECRET || !JWT_REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
const generateToken = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, rememberMeForAMonth = false) {
    try {
        const payload = {
            userId: userId,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: "10m",
        });
        if (!rememberMeForAMonth) {
            return { accessToken };
        }
        else {
            const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
                expiresIn: "30d",
            });
            yield prisma_1.default.user.update({
                where: { userId: userId },
                data: { refreshToken: refreshToken },
            });
            return { accessToken, refreshToken };
        }
    }
    catch (err) {
        console.log(err);
        return { error: "Error generating token" };
    }
});
exports.generateToken = generateToken;
const generateAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: { userId: payload.userId },
        });
        if (!user) {
            return { error: "invalid refresh token" };
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: payload.userId }, JWT_SECRET, {
            expiresIn: "10m",
        });
        return accessToken;
    }
    catch (err) {
        console.log(err);
        return { error: "Error generating access token" };
    }
});
exports.generateAccessToken = generateAccessToken;
