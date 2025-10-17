// Review validation schema using Zod
import { z } from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    mealId: z.string().optional(),
    comboId: z.string().optional(),
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
    comment: z.string().optional(),
  }),
});
