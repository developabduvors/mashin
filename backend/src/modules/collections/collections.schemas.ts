import { z } from "zod";

export const collectionSlugSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});
