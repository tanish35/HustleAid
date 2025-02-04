import prisma from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

interface AuthRequest extends Request {
  user?: any;
}

export const adminAuth = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const isAdmin = await prisma.admin.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!isAdmin) {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
    next();
  }
);
