import { z } from "zod";

const boolFromString = z
  .enum(["true", "false"])
  .transform((v) => v === "true")
  .optional();

export const carQuerySchema = z.object({
  query: z.object({
    brand: z.string().optional(), // brand slug
    model: z.string().optional(), // model slug
    condition: z.enum(["NEW", "USED"]).optional(),
    bodyType: z.enum(["SEDAN", "SUV", "HATCHBACK", "CROSSOVER", "MINIVAN", "COUPE"]).optional(),
    fuel: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "GAS"]).optional(),
    transmission: z.enum(["MT", "AT", "CVT", "ROBOT"]).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    minYear: z.coerce.number().int().optional(),
    maxYear: z.coerce.number().int().optional(),
    inStock: boolFromString,
    featured: boolFromString,
    q: z.string().trim().min(1).optional(),
    sort: z.enum(["price_asc", "price_desc", "year_desc", "newest"]).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
  }),
});

export const carIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type CarQuery = z.infer<typeof carQuerySchema>["query"];
