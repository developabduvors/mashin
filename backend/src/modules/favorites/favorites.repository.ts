import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

// Mashinani CarListItem'ga o'girish uchun kerakli relationlar (katalog bilan bir xil).
const carInclude = {
  brand: true,
  model: true,
  images: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.CarInclude;

export const favoritesRepository = {
  // Idempotent qo'shish — dublikat bo'lsa hech narsa o'zgartirmaydi.
  add(userId: string, carId: string) {
    return prisma.favorite.upsert({
      where: { userId_carId: { userId, carId } },
      create: { userId, carId },
      update: {},
    });
  },

  // Idempotent o'chirish — yo'q bo'lsa ham xato bermaydi.
  remove(userId: string, carId: string) {
    return prisma.favorite.deleteMany({ where: { userId, carId } });
  },

  // Foydalanuvchi saqlagan mashinalar (eng yangi avval), to'liq relationlar bilan.
  findCarsByUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { car: { include: carInclude } },
    });
  },

  carExists(carId: string) {
    return prisma.car.findUnique({ where: { id: carId }, select: { id: true } });
  },
};

export type FavoriteWithCar = Prisma.FavoriteGetPayload<{
  include: { car: { include: typeof carInclude } };
}>;
