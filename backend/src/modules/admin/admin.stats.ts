import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";

export const statsService = {
  async get() {
    const [cars, brands, leadsNew, byStatus] = await Promise.all([
      prisma.car.count(),
      prisma.brand.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);
    return {
      cars,
      brands,
      leadsNew,
      leadsByStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
    };
  },
};

export const statsController = {
  async get(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await statsService.get());
    } catch (e) { next(e); }
  },
};
