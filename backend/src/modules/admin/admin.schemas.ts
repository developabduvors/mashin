import { z } from "zod";

// Har resurs: create (majburiy maydonlar) + update (hammasi optional = .partial()).

// Sotib olingan mashina — admin user'ga mashinani biriktiradi.
export const purchaseCreate = z.object({
  userId: z.string().uuid(),
  carId: z.string().uuid(),
  purchasedAt: z.coerce.date().optional(),
});

export const brandCreate = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export const carModelCreate = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  brandId: z.string().uuid(),
});

export const carCreate = z.object({
  brandId: z.string().uuid(),
  modelId: z.string().uuid(),
  trim: z.string().min(1),
  year: z.number().int().min(1950).max(2100),
  condition: z.enum(["NEW", "USED"]).optional(),
  bodyType: z.enum(["SEDAN", "SUV", "HATCHBACK", "CROSSOVER", "MINIVAN", "COUPE"]),
  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "GAS"]),
  transmission: z.enum(["MT", "AT", "CVT", "ROBOT"]),
  price: z.number().nonnegative(),
  monthlyFrom: z.number().nonnegative().optional(),
  mileage: z.number().int().nonnegative().optional(),
  hasPts: z.boolean().optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  description: z.string().optional(),
});

export const carImageCreate = z.object({
  carId: z.string().uuid(),
  url: z.string().url(),
  isCover: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const collectionCreate = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().optional(),
});

export const creditProgramCreate = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  kind: z.enum(["CREDIT", "INSTALLMENT", "TRADE_IN", "TAXI", "SPECIAL"]).optional(),
  ratePercent: z.number().nonnegative().max(999).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const partnerBankCreate = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url(),
  isInsurer: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const reviewCreate = z.object({
  author: z.string().min(1),
  text: z.string().min(1),
  source: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isPublished: z.boolean().optional(),
});

export const ratingCreate = z.object({
  platform: z.string().min(1),
  rating: z.number().min(0).max(5),
  recommendPercent: z.number().int().min(0).max(100).optional(),
  url: z.string().url().optional(),
});

export const blogCreate = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  coverUrl: z.string().url().optional(),
  publishedAt: z.coerce.date().optional(), // ISO string → Date
});

export const cityCreate = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  isDefault: z.boolean().optional(),
});

export const dealershipCreate = z.object({
  cityId: z.string().uuid(),
  address: z.string().min(1),
  phones: z.array(z.string().min(1)).default([]),
  schedule: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Collection ↔ Car a'zolik (composite PK — alohida endpoint).
export const collectionCarSchema = z.object({
  body: z.object({ carId: z.string().uuid() }),
  params: z.object({ id: z.string().uuid() }),
});
