import { authenticate } from "@repo/middlewares";
import { Router } from "express";
import { factorizeController } from "./qr.controller";

const router = Router();

router.post("/factorize", authenticate, factorizeController);

export default router;
