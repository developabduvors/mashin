import { Request, Response, NextFunction } from "express";
import { favoritesService } from "./favorites.service";
import { favoriteParamsSchema } from "./favorites.schemas";

export const favoritesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      // authenticate middleware'dan keyin req.user kafolatlangan.
      const cars = await favoritesService.list(req.user!.id);
      res.status(200).json({ cars });
    } catch (e) { next(e); }
  },

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = favoriteParamsSchema.parse({ params: req.params });
      await favoritesService.add(req.user!.id, params.carId);
      res.status(201).json({ ok: true });
    } catch (e) { next(e); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = favoriteParamsSchema.parse({ params: req.params });
      await favoritesService.remove(req.user!.id, params.carId);
      res.status(204).send();
    } catch (e) { next(e); }
  },
};
