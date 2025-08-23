import mongoose, { Schema } from "mongoose";
import type { IPayment } from "./payment.interface.js";
import { PaymentStatus } from "@/enums/payment.enum.js";

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    transactionId: { type: String, unique: true, required: true },
    stripeSessionId: { type: String, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
