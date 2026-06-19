import { z } from "zod";

export const blogSlugSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

export const contactsQuerySchema = z.object({
  query: z.object({
    city: z.string().min(1).optional(), // city slug; berilmasa default shahar
  }),
});

export type ContactsQuery = z.infer<typeof contactsQuerySchema>["query"];

// Otziv yozish (login talab qiladi). author logindan olinadi — kiritilmaydi.
export const createReviewSchema = z.object({
  body: z.object({
    text: z.string().trim().min(10, "Otziv kamida 10 ta belgi bo'lsin").max(1000),
    rating: z.coerce.number().int().min(1).max(5),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
