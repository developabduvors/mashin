import { Router } from "express";
import { collectionsController } from "./collections.controller";
import { validate } from "../../middleware/validate";
import { collectionSlugSchema } from "./collections.schemas";

// /api ostiga ulanadi
export const collectionsRouter = Router();
collectionsRouter.get("/collections", collectionsController.list);
collectionsRouter.get(
  "/collections/:slug",
  validate(collectionSlugSchema),
  collectionsController.getBySlug,
);
