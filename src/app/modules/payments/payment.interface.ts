import type { PaymentStatus } from "@/enums/payment.enum.js";
import { Document, Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId; // Reference to User
  orderId: Types.ObjectId; // Reference to Order
  amount: number; // Payment amount
  method: string; // Payment method (e.g., card, cash, gateway name)
  status: PaymentStatus; // Enum for status
  transactionId?: string; // Gateway transaction reference
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentFilterOptions {
  searchTerm?: string;
  status?: PaymentStatus;
  userId?: Types.ObjectId;
  startAmount?: string;
  endAmount?: string;
}
