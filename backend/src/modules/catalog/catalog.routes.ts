import { Router } from "express";
import { catalogController } from "./catalog.controller";
import { validate } from "../../middleware/validate";
import { carIdSchema } from "./catalog.schemas";

export const catalogRouter = Router();

// /cars query coerce'i controller'da parse qilinadi (Express 5 req.query getter)
catalogRouter.get("/cars", catalogController.listCars);
catalogRouter.get("/cars/:id", validate(carIdSchema), catalogController.getCar);
catalogRouter.get("/brands", catalogController.listBrands);
