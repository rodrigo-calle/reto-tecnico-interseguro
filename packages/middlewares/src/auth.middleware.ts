import { Request, Response, NextFunction } from "express";
import axios from "axios";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }

  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/validate`,
      {},
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.data.valid) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    Object.assign(req, {
      auth: { token: authHeader.split(" ")[1] },
      ...response.data,
    });

    next();
  } catch (error) {
    console.log({ error });
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
