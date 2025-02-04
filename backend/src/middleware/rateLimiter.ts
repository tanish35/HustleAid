import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import requestIp from "request-ip";

const redisURL = process.env.REDIS_URL || "";

const redisClient = new Redis(redisURL);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 40,
  duration: 60,
});

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIp = requestIp.getClientIp(req) || "unknown";

  rateLimiter
    .consume(clientIp)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
};
