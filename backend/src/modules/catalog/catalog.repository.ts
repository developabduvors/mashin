

import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const carInclude = {
  brand: true,
  model: true,
  images: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.CarInclude;

export const catalogRepository = {
  findCars(args: {
    where: Prisma.CarWhereInput;
    orderBy: Prisma.CarOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.car.findMany({
      where: args.where,
      orderBy: args.orderBy,
      skip: args.skip,
      take: args.take,
      include: carInclude,
    });
  },

  countCars(where: Prisma.CarWhereInput) {
    return prisma.car.count({ where });
  },

  findCarById(id: string) {
    return prisma.car.findUnique({ where: { id }, include: carInclude });
  },

  findBrandsWithModels() {
    return prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { models: { orderBy: { name: "asc" } } },
    });
  },
};

export type CarWithRelations = Prisma.CarGetPayload<{ include: typeof carInclude }>;
