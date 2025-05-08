import express, { Request, Response } from "express";
import "dotenv/config";
import { authenticate } from "@repo/middlewares";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import { envs } from "./config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "API Gateway Reto técnico - Rodrigo Calle" });
});
const { AUTH_SERVICE_URL, QR_SERVICE_URL, PORT, STATS_SERVICE_URL } = envs;

app.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    pathRewrite: { "^/auth": "" },
    changeOrigin: true,
    // @ts-ignore
    onError: (err: Error, req: Request, res: Response) => {
      console.log(err);
      res.status(500).json({ error: "Auth service unavailable" });
    },
  })
);

app.use(authenticate);

app.use(
  "/qr",
  createProxyMiddleware({
    target: QR_SERVICE_URL,
    pathRewrite: { "^/qr": "" },
    changeOrigin: true,
    // @ts-ignore
    onError: (err: Error, req: Request, res: Response) => {
      res.status(500).json({ error: "QR service unavailable" });
    },
  })
);

app.use(
  "/stats",
  createProxyMiddleware({
    target: STATS_SERVICE_URL,
    pathRewrite: { "^/stats": "" },
    changeOrigin: true,
    // @ts-ignore
    onError: (err: Error, req: Request, res: Response) => {
      res.status(500).json({ error: "Stats service unavailable" });
    },
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
