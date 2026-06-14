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
