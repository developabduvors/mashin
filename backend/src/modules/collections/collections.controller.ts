import { Request, Response, NextFunction } from "express";
import { collectionsService } from "./collections.service";

export const collectionsController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const collections = await collectionsService.list();
      res.status(200).json({ collections });
    } catch (e) { next(e); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const collection = await collectionsService.getBySlug(req.params.slug as string);
      res.status(200).json({ collection });
    } catch (e) { next(e); }
  },
};
