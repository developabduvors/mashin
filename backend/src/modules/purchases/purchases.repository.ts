import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

// Katalog DTO'si uchun kerakli relationlar (favorites bilan bir xil).
const carInclude = {
  brand: true,
  model: true,
  images: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.CarInclude;

export const purchasesRepository = {
  // Foydalanuvchi sotib olgan mashinalar (eng yangi avval).
  findCarsByUser(userId: string) {
    return prisma.purchase.findMany({
      where: { userId },
      orderBy: { purchasedAt: "desc" },
      include: { car: { include: carInclude } },
    });
  },
};
