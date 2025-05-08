import { PrismaClient } from "../../../generated/prisma";
import { envs } from "../../config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { JWT_SECRET, TOKEN_EXPIRES_IN } = envs;
const prismaClient = new PrismaClient();

export const registerUser = async (username: string, password: string) => {
  const userRegistered = await prismaClient.user.findFirst({
    where: { username },
  });

  if (userRegistered) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prismaClient.user.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      password: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const loginUser = async (username: string, password: string) => {
  const user = await prismaClient.user.findFirst({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      type: "user",
    },
    JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRES_IN,
    }
  );

  await prismaClient.token.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + Number(TOKEN_EXPIRES_IN)),
    },
  });

  return token;
};

export const validateToken = async (
  token: string
): Promise<
  | Boolean
  | {
      valid: boolean;
      type: "user" | "client";
    }
> => {
  try {
    const tokenRegistered = await prismaClient.token.findUnique({
      where: { token, expiresAt: { gt: new Date() } },
    });

    if (!tokenRegistered) {
      return false;
    }

    jwt.verify(token, JWT_SECRET);

    return {
      valid: true,
      type: tokenRegistered.userId ? "user" : "client",
    };
  } catch (error) {
    return false;
  }
};
