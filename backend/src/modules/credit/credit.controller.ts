import { Request, Response, NextFunction } from "express";
import { creditService } from "./credit.service";

export const creditController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const programs = await creditService.list();
      res.status(200).json({ programs });
    } catch (e) { next(e); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const program = await creditService.getBySlug(req.params.slug as string);
      res.status(200).json({ program });
    } catch (e) { next(e); }
  },
};
