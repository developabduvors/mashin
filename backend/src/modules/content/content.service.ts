import type { Dealership, Review } from "@prisma/client";
import { contentRepository } from "./content.repository";
import { AppError } from "../../utils/AppError";
import type { ContactsQuery, CreateReviewInput } from "./content.schemas";
import type {
  PartnerBankItem,
  ReviewItem,
  RatingItem,
  BlogListItem,
  BlogDetail,
  CityItem,
  DealershipItem,
  ContactsResult,
} from "./content.types";

function toReviewItem(r: Review): ReviewItem {
  return {
    id: r.id,
    author: r.author,
    text: r.text,
    source: r.source,
    rating: r.rating,
    createdAt: r.createdAt.toISOString(),
  };
}

function toDealership(d: Dealership): DealershipItem {
  return {
    id: d.id,
    address: d.address,
    phones: d.phones,
    schedule: d.schedule,
    lat: d.lat,
    lng: d.lng,
  };
}

export const contentService = {
  async partnerBanks(): Promise<PartnerBankItem[]> {
    const banks = await contentRepository.findPartnerBanks();
    return banks.map((b) => ({
      id: b.id,
      name: b.name,
      logoUrl: b.logoUrl,
      isInsurer: b.isInsurer,
    }));
  },

  async reviews(): Promise<ReviewItem[]> {
    const reviews = await contentRepository.findPublishedReviews();
    return reviews.map(toReviewItem);
  },

  // Login qilgan buyer otziv yozadi. author req'dan EMAS — DB'dagi fullName'dan.
  async createReview(userId: string, input: CreateReviewInput): Promise<ReviewItem> {
    const user = await contentRepository.findUserById(userId);
    if (!user) throw new AppError("Foydalanuvchi topilmadi", 404, "USER_NOT_FOUND");
    const review = await contentRepository.createReview({
      userId,
      author: user.fullName,
      text: input.text,
      rating: input.rating,
    });
    return toReviewItem(review);
  },

  async ratings(): Promise<RatingItem[]> {
    const ratings = await contentRepository.findRatings();
    return ratings.map((r) => ({
      id: r.id,
      platform: r.platform,
      rating: Number(r.rating),
      recommendPercent: r.recommendPercent,
      url: r.url,
    }));
  },

  async blogList(): Promise<BlogListItem[]> {
    const posts = await contentRepository.findPublishedPosts();
    return posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverUrl: p.coverUrl,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    }));
  },

  async blogPost(slug: string): Promise<BlogDetail> {
    const p = await contentRepository.findPublishedPostBySlug(slug);
    if (!p) throw new AppError("Maqola topilmadi", 404, "BLOG_POST_NOT_FOUND");
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverUrl: p.coverUrl,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      body: p.body,
    };
  },

  async cities(): Promise<CityItem[]> {
    const cities = await contentRepository.findCities();
    return cities.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      isDefault: c.isDefault,
    }));
  },

  // city berilsa o'sha shahar, aks holda default shahar kontaktlari.
  async contacts(q: ContactsQuery): Promise<ContactsResult> {
    const city = q.city
      ? await contentRepository.findCityBySlug(q.city)
      : await contentRepository.findDefaultCity();
    if (!city) throw new AppError("Shahar topilmadi", 404, "CITY_NOT_FOUND");
    return {
      city: { id: city.id, name: city.name, slug: city.slug, isDefault: city.isDefault },
      dealerships: city.dealerships.map(toDealership),
    };
  },
};
