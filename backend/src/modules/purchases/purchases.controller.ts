import { Request, Response, NextFunction } from "express";
import { purchasesService } from "./purchases.service";

export const purchasesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      // authenticate middleware'dan keyin req.user kafolatlangan.
      const cars = await purchasesService.list(req.user!.id);
      res.status(200).json({ cars });
    } catch (e) { next(e); }
  },
};
