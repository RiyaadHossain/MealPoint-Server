// Order validation schemas using Zod
import { z } from "zod";
import { OrderItemType, OrderStatus, OrderType } from "@/enums/order.enum.js";
import { MenuSize } from "@/enums/menu.enum.js";

const orderItemSchema = z.object({
  menuItemId: z.string().min(1).optional(),
  comboItemId: z.string().min(1).optional(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  size: z.enum(Object.values(MenuSize)).optional(),
  type: z.enum(Object.values(OrderItemType)),
});

export const createOrderSchema = z.object({
  body: z.object({
    discount: z.string().optional(),
    type: z.enum(Object.values(OrderType)),
    deliveryAddress: z.string().optional(),
    discountId: z.string().optional(),
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
