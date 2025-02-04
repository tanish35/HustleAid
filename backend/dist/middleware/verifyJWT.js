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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = __importDefault(require("../secrets"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const { JWT_SECRET } = secrets_1.default;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
        ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
    if (!token) {
        return res.status(401).json({ message: "user not logged in" });
    }
    else {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = yield prisma_1.default.user.findUnique({
                where: {
                    // @ts-ignore
                    userId: decoded.userId,
                },
            });
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            req.user = user;
            //   req.user = decoded;
            next();
        }
        catch (err) {
            res.status(401).json({ message: "Invalid access token" });
        }
    }
});
exports.default = verifyJWT;
