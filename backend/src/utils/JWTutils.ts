import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import secrets from "../secrets";

const { JWT_SECRET, JWT_REFRESH_TOKEN_SECRET } = secrets;
if (!JWT_SECRET || !JWT_REFRESH_TOKEN_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const generateToken = async (
  userId: any,
  rememberMeForAMonth = false
) => {
  try {
    const payload = {
      userId: userId,
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "10m",
    });
    if (!rememberMeForAMonth) {
      return { accessToken };
    } else {
      const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      await prisma.user.update({
        where: { userId: userId },
        data: { refreshToken: refreshToken },
      });

      return { accessToken, refreshToken };
    }
  } catch (err) {
    console.log(err);
    return { error: "Error generating token" };
  }
};

export const generateAccessToken = async (refreshToken: any) => {
  try {
    const payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;
    const user = await prisma.user.findUnique({
      where: { userId: payload.userId },
    });
    if (!user) {
      return { error: "invalid refresh token" };
    }
    const accessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, {
      expiresIn: "10m",
    });

    return accessToken;
  } catch (err) {
    console.log(err);
    return { error: "Error generating access token" };
  }
};
