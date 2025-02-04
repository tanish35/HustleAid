"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
function checkAuth(req, res, next) {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    // console.log("Token:", token);
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        prisma_1.default.user
            .findUnique({
            where: {
                userId: decoded.sub,
            },
        })
            .then((user) => {
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            req.user = user;
            next();
        })
            .catch((err) => {
            console.error(err);
            res.status(401).json({ message: "Invalid token" });
        });
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid token" });
    }
}
// export default requireAuth;
