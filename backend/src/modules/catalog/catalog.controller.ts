import { Request, Response, NextFunction } from "express";
import { catalogService } from "./catalog.service";
import { carQuerySchema } from "./catalog.schemas";

export const catalogController = {
  async listCars(req: Request, res: Response, next: NextFunction) {
    try {
      // Express 5 req.query faqat getter — coerce qilingan qiymatni shu yerda olamiz
      const { query } = carQuerySchema.parse({ query: req.query });
      const result = await catalogService.listCars(query);
      res.status(200).json(result);
    } catch (e) { next(e); }
  },

  async getCar(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await catalogService.getCar(req.params.id as string);
      res.status(200).json({ car });
    } catch (e) { next(e); }
  },

  async listBrands(_req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await catalogService.listBrands();
      res.status(200).json({ brands });
    } catch (e) { next(e); }
  },
};
