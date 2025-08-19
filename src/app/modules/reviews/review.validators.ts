// Review validation schema using Zod
import { z } from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    orderId: z.string().nonempty("Order ID is required"),
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
    comment: z.string().optional(),
  }),
});
