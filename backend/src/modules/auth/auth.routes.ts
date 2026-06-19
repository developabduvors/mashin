import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateMeSchema,
  changePasswordSchema,
} from "./auth.schemas";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/refresh", validate(refreshSchema), authController.refresh);
authRouter.post("/logout", validate(refreshSchema), authController.logout);
authRouter.get("/me", authenticate, authController.me);
authRouter.patch("/me", authenticate, validate(updateMeSchema), authController.updateMe);
authRouter.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword,
);
