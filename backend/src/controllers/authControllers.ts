import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

import { generateToken, generateAccessToken } from "../utils/JWTutils";

const cookieCondition = {
  secure: true,
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};

class authControllers {
  register = async (req: any, res: any) => {
    const { name, email, password, rememberMeForAMonth } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      const { accessToken, refreshToken } = await generateToken(
        user.userId,
        rememberMeForAMonth === true
      );

      res
        .status(201)
        .cookie("accessToken", accessToken, cookieCondition)
        .cookie("refreshToken", refreshToken, cookieCondition)
        .json({
          message: "User registered successfully",
          userId: user.userId,
          email: user.email,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error registering user" });
    }
  };

  login = async (req: any, res: any) => {
    const { email, password, rememberMeForAMonth } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid email" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const { accessToken, refreshToken } = await generateToken(
        user.userId,
        rememberMeForAMonth === true
      );

      res
        .status(200)
        .cookie("accessToken", accessToken, cookieCondition)
        .cookie("refreshToken", refreshToken, cookieCondition)
        .json({
          message: "Login successful",
          userId: user.userId,
          email: user.email,
        });
    } catch (err) {
      res.status(500).json({ message: "Error logging in" });
    }
  };

  logout = async (req: any, res: any) => {
    res.clearCookie("accessToken").clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  };

  refreshToken = async (req: any, res: any) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
      const accessToken = await generateAccessToken(refreshToken);

      if (!accessToken) {
        return res.status(400).json({ message: "Invalid refresh token" });
      }

      res
        .status(200)
        .cookie("accessToken", accessToken, cookieCondition)
        .json({ message: "Refresh token successful" });
    } catch (err) {
      res.status(500).json({ message: "Error refreshing token" });
    }
  };
}

export default new authControllers();
