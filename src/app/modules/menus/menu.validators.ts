import { z } from "zod";

export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    basePrice: z.number().min(0).optional(),
    hasVariants: z.boolean(),
    variations: z
      .array(z.object({ size: z.string(), price: z.number().min(0) }))
      .optional(),
    category: z.string().min(1), // ObjectId as string
    image: z.string().url(),
    available: z.boolean().optional(),
    totalSold: z.number().min(0).optional(),
    label: z.string().optional(),
    estimatedTime: z.number().min(1),
  }),
});

export const updateMenuSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(500).optional(),
    basePrice: z.number().min(0).optional(),
    category: z.string().min(1).optional(),
    image: z.string().url().optional(),
    available: z.boolean().optional(),
    totalSold: z.number().min(0).optional(),
    label: z.string().optional(),
    estimatedTime: z.number().min(1).optional(),
  }),
});
