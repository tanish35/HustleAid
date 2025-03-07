import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendMail from "../mail/sendMail";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, walletId } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      walletId,
    },
  });

  const verificationToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
    expiresIn: "1d",
  });

  const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;

  const htmlContent = `
      <h1>Welcome to Hustle Aid, ${user.name}!</h1>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

  sendMail(htmlContent, user.email, "Verify Your Email - Hustle Aid");

  res.status(201).json({
    userId: user.userId,
    name: user.name,
    email: user.email,
    walletId: user.walletId,
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await prisma.user.update({
      where: { userId: decoded.userId },
      data: {
        isVerified: true,
      },
    });

    res.json({ message: "Email verified" });
  } catch (error) {
    res.status(401);
    throw new Error("Invalid or expired token");
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user?.password) {
    res.status(401).json({
      error: "You have logged in with Google. Please use Google Sign-In",
    });
    return;
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.isVerified === false) {
      res.status(401);
      throw new Error("Email not verified");
    }

    const exp = Date.now() + 1000 + 60 * 60 * 24 * 30;

    const token = jwt.sign({ sub: user.userId, exp }, process.env.JWT_SECRET!);

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
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          isVerified: true,
        },
      });
    }

    const exp = Date.now() + 1000 + 60 * 60 * 24 * 30;

    const token = jwt.sign({ sub: user.userId, exp }, process.env.JWT_SECRET!);

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
  } catch (error) {
    res.status(401);
    throw new Error("Invalid Google token");
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export const addWalletId = asyncHandler(async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  const user = await prisma.user.update({
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
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { userId: req.user.userId },
  });

  if (user?.isVerified === false) {
    res.status(401);
    throw new Error("Email not verified");
  }

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
    throw new Error("User not found");
  }
});

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, dob, gender } = req.body;
    //@ts-ignore
    const userId = req.user?.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        name,
        dob,
        gender,

        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "An error occurred while updating the profile",
      error: (error as Error).message,
    });
  }
};
