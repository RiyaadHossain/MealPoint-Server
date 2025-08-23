import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, "Order ID is required"),
    amount: z.number().positive("Amount must be greater than zero"),
    method: z.string().min(1, "Payment method is required"),
  }),
});

export const updatePaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "success", "failed", "cancelled"]),
    session_id: z.string()
  }),
});


