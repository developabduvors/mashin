import { prisma } from "../../lib/prisma";

export const creditRepository = {
  // Public faqat faol dasturlarni ko'radi.
  findActive() {
    return prisma.creditProgram.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  },

  findActiveBySlug(slug: string) {
    return prisma.creditProgram.findFirst({
      where: { slug, isActive: true },
    });
  },
};
