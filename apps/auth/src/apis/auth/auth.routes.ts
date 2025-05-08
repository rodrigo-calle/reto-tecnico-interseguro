import { Router } from "express";
import authController from "./auth.controller";

import { loginSchema, registerSchema } from "@repo/schemas";
import { validate } from "@repo/middlewares";

const router = Router();
const { loginUserController, registerUserController, validateTokenController } =
  authController;

router.post("/register", registerUserController);
router.post("/login", validate(loginSchema), loginUserController);
router.post("/validate", validateTokenController);

export default router;
