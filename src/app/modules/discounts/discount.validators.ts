import { DiscountType } from "@/enums/discount.enum.js";
import { z } from "zod";

// Validation schema for creating a discount
export const createDiscountSchema = z.object({
  body: z.object({
    type: z.enum(Object.values(DiscountType)),
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    percentage: z.number().min(0).max(100),
    flatAmount: z.number().min(0).optional(),
    level: z.string().optional(),
    promoCode: z.string().max(50).optional(),
    maxUsagePerUser: z.number().min(1).optional(),
    maxUsageGlobal: z.number().min(0).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
    createdBy: z.string().optional(),
  }),
});

// Validation schema for updating a discount
export const updateDiscountSchema = z.object({
  body: z.object({
    type: z.enum(Object.values(DiscountType)).optional(),
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    percentage: z.number().min(0).max(100).optional(),
    flatAmount: z.number().min(0).optional(),
    level: z.string().optional(),
    promoCode: z.string().max(50).optional(),
    maxUsagePerUser: z.number().min(1).optional(),
    maxUsageGlobal: z.number().min(0).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
    createdBy: z.string().optional(),
  }),
});

// Validation schema for applying a discount
export const applyDiscountSchema = z.object({
  body: z.object({
    orderId: z.string().min(1), // ObjectId as string
    discountId: z.string().min(1), // ObjectId as string
    type: z.enum(Object.values(DiscountType)),
    promoCode: z.string().max(50).optional(),
  }),
});
