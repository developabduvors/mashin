import { Request, Response, NextFunction } from "express";
import { leadsService } from "./leads.service";
import {
  createLeadSchema,
  adminLeadQuerySchema,
  updateLeadSchema,
} from "./leads.schemas";

export const leadsController = {
  // Public — validate middleware'dan o'tdi, lekin transform qilingan
  // (tozalangan telefon) qiymatni olish uchun shu yerda qayta parse qilamiz.
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = createLeadSchema.parse({ body: req.body });
      const lead = await leadsService.create(body);
      res.status(201).json({ lead });
    } catch (e) { next(e); }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = adminLeadQuerySchema.parse({ query: req.query });
      const result = await leadsService.list(query);
      res.status(200).json(result);
    } catch (e) { next(e); }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { params, body } = updateLeadSchema.parse({
        params: req.params,
        body: req.body,
      });
      const lead = await leadsService.updateStatus(params.id, body);
      res.status(200).json({ lead });
    } catch (e) { next(e); }
  },
};
