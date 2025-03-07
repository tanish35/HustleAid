import jwt from "jsonwebtoken";
import secrets from "../secrets";
import prisma from "../lib/prisma";
import { NextFunction } from "express";

const { JWT_SECRET } = secrets;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const verifyJWT = async (req: any, res: any, next: NextFunction) => {
  console.log("Verifying JWT...");
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "user not logged in" });
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: {
          // @ts-ignore
          userId: decoded.sub,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid access token" });
    }
  }
};

export default verifyJWT;
