import { Router } from "express";
import { purchasesController } from "./purchases.controller";
import { authenticate } from "../../middleware/authenticate";

// /api ostiga ulanadi → /api/me/purchases
// Auth butun router'ga emas, route'ga (leads/favorites bilan bir xil sabab).
export const purchasesRouter = Router();

purchasesRouter.get("/me/purchases", authenticate, purchasesController.list);
