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

  findUserById(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  },

  createReview(data: {
    userId: string;
    author: string;
    text: string;
    rating: number;
  }) {
    return prisma.review.create({
      data: {
        userId: data.userId,
        author: data.author,
        text: data.text,
        rating: data.rating,
        source: "Сайт", // saytda yozilgan otzivlar uchun manba
        isPublished: true, // darhol ko'rinadi (login talab qilingani uchun)
      },
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
