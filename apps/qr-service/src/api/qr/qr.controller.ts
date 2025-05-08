import { Request, Response, Router } from "express";
import { factorize } from "./qr.service";

export const factorizeController = async (req: Request, res: Response) => {
  try {
    const { matrix } = req.body;
    const result = factorize(matrix);
    const statsResponse = await fetch("http://stats-service:3004/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization || "",
      },
      body: JSON.stringify({ matrices: [result.Q, result.R] }),
    });

    const stats = await statsResponse.json();

    res.json({ ...result, stats });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
};
