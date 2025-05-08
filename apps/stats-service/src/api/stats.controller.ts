import { Request, Response, Router } from "express";
import { analyzeMatrices } from "./stats.service";

const router = Router();

export const statsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { matrices } = req.body;
    if (!req.body || !req.body.matrices) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe contener un array de matrices",
      });
    }

    const stats = analyzeMatrices(matrices);
    res.json(stats);
  } catch (error) {
    console.error("Error en stats controller:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
