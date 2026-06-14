import { prisma } from "../../lib/prisma";

export const contentRepository = {
  findPartnerBanks() {
    return prisma.partnerBank.findMany({ orderBy: { sortOrder: "asc" } });
  },

  findPublishedReviews() {
    return prisma.review.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  },

  findRatings() {
    return prisma.externalRating.findMany({ orderBy: { platform: "asc" } });
  },

  // Blog ro'yxati — faqat chop etilgan (publishedAt != null).
  findPublishedPosts() {
    return prisma.blogPost.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
    });
  },

  findPublishedPostBySlug(slug: string) {
    return prisma.blogPost.findFirst({
      where: { slug, publishedAt: { not: null } },
    });
  },

  findCities() {
    return prisma.city.findMany({ orderBy: { name: "asc" } });
  },

  findCityBySlug(slug: string) {
    return prisma.city.findUnique({
      where: { slug },
      include: { dealerships: true },
    });
  },

  findDefaultCity() {
    return prisma.city.findFirst({
      where: { isDefault: true },
      include: { dealerships: true },
    });
  },
};
