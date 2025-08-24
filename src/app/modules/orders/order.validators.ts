// Order validation schemas using Zod
import { z } from "zod";
import { OrderItemType, OrderStatus, OrderType } from "@/enums/order.enum.js";

const orderItemSchema = z.object({
  menuItemId: z.string().min(1).optional(),
  comboItemId: z.string().min(1).optional(),
  quantity: z.number().min(1),
  type: z.enum(Object.values(OrderItemType)),
});

export const createOrderSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(OrderStatus)).optional(),
    discount: z.string().optional(),
    type: z.enum(Object.values(OrderType)),
    deliveryAddress: z.string().optional(),
    discountIds: z.array(z.string()),
    notes: z.string().optional(),
    items: z
      .array(orderItemSchema)
      .min(1, "At least one order item is required"),
  }),
});

export const updateOrderSchema = z.object({
  body: z.object({
    discount: z.string().optional(),
    type: z.enum(Object.values(OrderType)).optional(),
    deliveryAddress: z.string().optional(),
    notes: z.string().optional(),
    items: z
      .array(orderItemSchema)
      .min(1, "At least one order item is required")
      .optional(),
    status: z.enum(Object.values(OrderStatus)).optional(),
  }),
});
