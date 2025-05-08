import { validate } from "@repo/middlewares/";
import { Router } from "express";
import { statsController } from "./stats.controller";
import { matricesSchema } from "@repo/schemas";

const router = Router();
router.post("/analyze", validate(matricesSchema), statsController);

export default router;
