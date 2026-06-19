import { Router } from "express";
import { favoritesController } from "./favorites.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { favoriteParamsSchema } from "./favorites.schemas";

// /api ostiga ulanadi → /api/favorites
// MUHIM (leads bilan bir xil sabab): auth butun router'ga emas, HAR route'ga
// alohida qo'yiladi — aks holda /api orqali o'tgan keyingi public routerlarni bloklaydi.
export const favoritesRouter = Router();

favoritesRouter.get("/favorites", authenticate, favoritesController.list);
favoritesRouter.post(
  "/favorites/:carId",
  authenticate,
  validate(favoriteParamsSchema),
  favoritesController.add,
);
favoritesRouter.delete(
  "/favorites/:carId",
  authenticate,
  validate(favoriteParamsSchema),
  favoritesController.remove,
);
