import { z } from "zod";

export const creditSlugSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});
