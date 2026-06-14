import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

// Car kartochkasi uchun kerakli relationlar (catalog'dagi bilan bir xil shakl).
const carInclude = {
  brand: true,
  model: true,
  images: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.CarInclude;

const detailInclude = {
  cars: { include: { car: { include: carInclude } } },
} satisfies Prisma.CollectionInclude;

export const collectionsRepository = {
  findAll() {
    return prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { cars: true } } },
    });
  },

  findBySlug(slug: string) {
    return prisma.collection.findUnique({
      where: { slug },
      include: detailInclude,
    });
  },
};

export type CollectionWithCount = Prisma.CollectionGetPayload<{
  include: { _count: { select: { cars: true } } };
}>;
export type CollectionWithCars = Prisma.CollectionGetPayload<{
  include: typeof detailInclude;
}>;
export type CollectionCarWithRelations = Prisma.CarGetPayload<{
  include: typeof carInclude;
}>;
