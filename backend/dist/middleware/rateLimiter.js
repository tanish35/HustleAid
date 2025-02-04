"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterMiddleware = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const request_ip_1 = __importDefault(require("request-ip"));
const redisURL = process.env.REDIS_URL || "";
const redisClient = new ioredis_1.default(redisURL);
const rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: 40,
    duration: 60,
});
const rateLimiterMiddleware = (req, res, next) => {
    const clientIp = request_ip_1.default.getClientIp(req) || "unknown";
    rateLimiter
        .consume(clientIp)
        .then(() => {
        next();
    })
        .catch(() => {
        res.status(429).send("Too Many Requests");
    });
};
exports.rateLimiterMiddleware = rateLimiterMiddleware;
