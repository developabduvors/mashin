import { z } from "zod";

// POST/DELETE /api/favorites/:carId — carId UUID bo'lishi shart.
export const favoriteParamsSchema = z.object({
  params: z.object({ carId: z.string().uuid() }),
});

export type FavoriteParams = z.infer<typeof favoriteParamsSchema>["params"];
