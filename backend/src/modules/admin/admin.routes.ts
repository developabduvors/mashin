import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { createCrudRouter, type CrudDelegate } from "./crud.factory";
import { statsController } from "./admin.stats";
import { collectionCarsController } from "./admin.collections";
import * as s from "./admin.schemas";

// Prisma delegate'lar CrudDelegate shartnomasini qondiradi (cast bilan).
const d = (delegate: unknown) => delegate as CrudDelegate;

export const adminRouter = Router();

// Barcha /admin/* yo'llari ADMIN talab qiladi.
adminRouter.use(authenticate, authorize("ADMIN"));

// Dashboard
adminRouter.get("/admin/stats", statsController.get);

// Foydalanuvchilar ro'yxati (purchase formasida dropdown uchun) — passwordHash CHIQMAYDI.
adminRouter.get("/admin/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "BUYER" },
      select: { id: true, fullName: true, email: true, phone: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ users });
  } catch (e) { next(e); }
});

// Sotib olingan mashinalar — admin biriktiradi/o'chiradi.
adminRouter.use("/admin/purchases", createCrudRouter({
  delegate: d(prisma.purchase),
  createSchema: s.purchaseCreate,
  updateSchema: s.purchaseCreate.partial(),
  code: "PURCHASE",
  orderBy: { createdAt: "desc" },
  // user relation'da SELECT — passwordHash hech qachon chiqmaydi.
  include: {
    user: { select: { id: true, fullName: true, email: true } },
    car: { include: { brand: true, model: true, images: true } },
  },
}));

// Collection ↔ Car a'zolik (CRUD'dan oldin — aniqroq yo'l)
adminRouter.post("/admin/collections/:id/cars", collectionCarsController.add);
adminRouter.delete("/admin/collections/:id/cars/:carId", collectionCarsController.remove);

// Generic CRUD: har resurs delegate + create + update(=partial) bilan ulanadi.
adminRouter.use("/admin/brands", createCrudRouter({
  delegate: d(prisma.brand), createSchema: s.brandCreate, updateSchema: s.brandCreate.partial(),
  code: "BRAND", orderBy: { name: "asc" },
}));
adminRouter.use("/admin/car-models", createCrudRouter({
  delegate: d(prisma.carModel), createSchema: s.carModelCreate, updateSchema: s.carModelCreate.partial(),
  code: "CAR_MODEL", orderBy: { name: "asc" },
}));
adminRouter.use("/admin/cars", createCrudRouter({
  delegate: d(prisma.car), createSchema: s.carCreate, updateSchema: s.carCreate.partial(),
  code: "CAR", orderBy: { createdAt: "desc" },
  include: { brand: true, model: true, images: true },
}));
adminRouter.use("/admin/car-images", createCrudRouter({
  delegate: d(prisma.carImage), createSchema: s.carImageCreate, updateSchema: s.carImageCreate.partial(),
  code: "CAR_IMAGE",
}));
adminRouter.use("/admin/collections", createCrudRouter({
  delegate: d(prisma.collection), createSchema: s.collectionCreate, updateSchema: s.collectionCreate.partial(),
  code: "COLLECTION", orderBy: { sortOrder: "asc" },
}));
adminRouter.use("/admin/credit-programs", createCrudRouter({
  delegate: d(prisma.creditProgram), createSchema: s.creditProgramCreate, updateSchema: s.creditProgramCreate.partial(),
  code: "CREDIT_PROGRAM", orderBy: { sortOrder: "asc" },
}));
adminRouter.use("/admin/partner-banks", createCrudRouter({
  delegate: d(prisma.partnerBank), createSchema: s.partnerBankCreate, updateSchema: s.partnerBankCreate.partial(),
  code: "PARTNER_BANK", orderBy: { sortOrder: "asc" },
}));
adminRouter.use("/admin/reviews", createCrudRouter({
  delegate: d(prisma.review), createSchema: s.reviewCreate, updateSchema: s.reviewCreate.partial(),
  code: "REVIEW", orderBy: { createdAt: "desc" },
}));
adminRouter.use("/admin/ratings", createCrudRouter({
  delegate: d(prisma.externalRating), createSchema: s.ratingCreate, updateSchema: s.ratingCreate.partial(),
  code: "RATING", orderBy: { platform: "asc" },
}));
adminRouter.use("/admin/blog", createCrudRouter({
  delegate: d(prisma.blogPost), createSchema: s.blogCreate, updateSchema: s.blogCreate.partial(),
  code: "BLOG_POST", orderBy: { createdAt: "desc" },
}));
adminRouter.use("/admin/cities", createCrudRouter({
  delegate: d(prisma.city), createSchema: s.cityCreate, updateSchema: s.cityCreate.partial(),
  code: "CITY", orderBy: { name: "asc" }, include: { dealerships: true },
}));
adminRouter.use("/admin/dealerships", createCrudRouter({
  delegate: d(prisma.dealership), createSchema: s.dealershipCreate, updateSchema: s.dealershipCreate.partial(),
  code: "DEALERSHIP",
}));
