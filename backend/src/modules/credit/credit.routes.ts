import { Router } from "express";
import { creditController } from "./credit.controller";
import { validate } from "../../middleware/validate";
import { creditSlugSchema } from "./credit.schemas";

// /api ostiga ulanadi → /api/credit-programs
export const creditRouter = Router();
creditRouter.get("/credit-programs", creditController.list);
creditRouter.get(
  "/credit-programs/:slug",
  validate(creditSlugSchema),
  creditController.getBySlug,
);
