import { z } from "zod";

export const comboItemSchema = z.object({
  item: z.string().min(1, "Menu item reference required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be >= 0"),
});

export const createComboSchema = z.object({
  body: z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    description: z.string().optional(),
    totalPrice: z.number().min(0),
    image: z.string().url().optional(),
    items: z.array(comboItemSchema).min(1),
    estimatedTime: z.string().optional(),
  }),
});

export const updateComboSchema = z.object({
  body: z.object({
    name: z.string().min(5, "Name must be at least 5 characters").optional(),
    description: z.string().optional(),
    totalPrice: z.number().min(0).optional(),
    image: z.string().url().optional(),
    items: z.array(comboItemSchema).min(1).optional(),
    estimatedTime: z.string().optional(),
  }),
});
