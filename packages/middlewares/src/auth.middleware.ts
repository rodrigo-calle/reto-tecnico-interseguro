import { Request, Response, NextFunction } from "express";
import axios from "axios";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/validate`,
      {
        headers: { Authorization: authHeader },
      }
    );

    if (!response.data.valid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    (req as any).auth = {
      token: authHeader.split(" ")[1],
      ...response.data,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
}

export function authorize(roles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.length > 0 && !roles.includes((req as any).auth?.type)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
