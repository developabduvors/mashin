import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { collectionCarSchema } from "./admin.schemas";

// Collection ichiga mashina qo'shish/olib tashlash — CollectionCar composite
// PK bo'lgani uchun generic CRUD'ga mos kelmaydi, alohida boshqariladi.
export const collectionCarsController = {
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { params, body } = collectionCarSchema.parse({
        params: req.params,
        body: req.body,
      });
      await prisma.collectionCar.create({
        data: { collectionId: params.id, carId: body.carId },
      });
      res.status(201).json({ ok: true });
    } catch (e) {
      // P2002 = a'zolik allaqachon bor; P2003 = collection/car mavjud emas.
      const code = (e as { code?: string }).code;
      if (code === "P2002") return next(new AppError("Allaqachon qo'shilgan", 409, "ALREADY_IN_COLLECTION"));
      if (code === "P2003") return next(new AppError("Podborka yoki mashina topilmadi", 404, "NOT_FOUND"));
      next(e);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.collectionCar.delete({
        where: {
          collectionId_carId: {
            collectionId: req.params.id as string,
            carId: req.params.carId as string,
          },
        },
      });
      res.status(204).end();
    } catch (e) {
      if ((e as { code?: string }).code === "P2025")
        return next(new AppError("A'zolik topilmadi", 404, "NOT_FOUND"));
      next(e);
    }
  },
};
