import { Request, Response, Router } from "express";
import { loginUser, registerUser, validateToken } from "./auth.service";
import { ZodError } from "zod";

const registerUserController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await registerUser(username, password);
  res.status(201).json(result);
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    res.json({ token });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const validateTokenController = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }

  const isValid = await validateToken(token);
  res.status(200).json({ valid: isValid });
};

export default {
  registerUserController,
  loginUserController,
  validateTokenController,
};
