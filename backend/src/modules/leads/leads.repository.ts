import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const leadsRepository = {
  create(data: Prisma.LeadCreateInput) {
    return prisma.lead.create({ data, select: { id: true, status: true } });
  },

  findMany(args: {
    where: Prisma.LeadWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.lead.findMany({
      where: args.where,
      orderBy: { createdAt: "desc" },
      skip: args.skip,
      take: args.take,
    });
  },

  count(where: Prisma.LeadWhereInput) {
    return prisma.lead.count({ where });
  },

  update(id: string, data: Prisma.LeadUpdateInput) {
    return prisma.lead.update({ where: { id }, data });
  },

  findById(id: string) {
    return prisma.lead.findUnique({ where: { id } });
  },
};
