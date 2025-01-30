import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.token;
  // console.log("Token:", token);
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
    };
    prisma.user
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
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
}

export default requireAuth;
