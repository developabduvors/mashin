import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../../utils/AppError";

// Har Prisma delegate (prisma.brand, prisma.car, ...) shu metodlarga ega —
// strukturaviy tiplash o'rniga minimal shartnoma bilan ishlaymiz.
export interface CrudDelegate {
  findMany(args?: unknown): Promise<unknown[]>;
  findUnique(args: unknown): Promise<unknown | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
  count(args?: unknown): Promise<number>;
}

interface CrudConfig {
  delegate: CrudDelegate;
  createSchema: z.ZodType;
  updateSchema: z.ZodType;
  code: string; // resurs kodi: CAR, BRAND, ... (xato kodida ishlatiladi)
  orderBy?: unknown; // ro'yxat tartibi
  include?: unknown; // bog'liq relationlar
}

const pageQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Prisma "record not found" (P2025) → 404 AppError.
function isNotFound(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2025";
}

// Bitta resurs uchun to'liq REST CRUD router quradi.
export function createCrudRouter(cfg: CrudConfig): Router {
  const { delegate, createSchema, updateSchema, code, orderBy, include } = cfg;
  const router = Router();

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = pageQuery.parse(req.query);
      const [items, total] = await Promise.all([
        delegate.findMany({ orderBy, include, skip: (page - 1) * limit, take: limit }),
        delegate.count(),
      ]);
      res.status(200).json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { next(e); }
  });

  router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await delegate.findUnique({ where: { id: req.params.id }, include });
      if (!item) throw new AppError("Topilmadi", 404, `${code}_NOT_FOUND`);
      res.status(200).json({ item });
    } catch (e) { next(e); }
  });

  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createSchema.parse(req.body);
      const item = await delegate.create({ data });
      res.status(201).json({ item });
    } catch (e) { next(e); }
  });

  router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateSchema.parse(req.body);
      const item = await delegate.update({ where: { id: req.params.id }, data });
      res.status(200).json({ item });
    } catch (e) {
      if (isNotFound(e)) return next(new AppError("Topilmadi", 404, `${code}_NOT_FOUND`));
      next(e);
    }
  });

  router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await delegate.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch (e) {
      if (isNotFound(e)) return next(new AppError("Topilmadi", 404, `${code}_NOT_FOUND`));
      next(e);
    }
  });

  return router;
}
