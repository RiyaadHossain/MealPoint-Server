import { Schema, model } from "mongoose";
import type { IDiscount, IDiscountUsage } from "./discount.interface.js";
import { DiscountType } from "@/enums/discount.enum.js";

// Discount schema definition
const discountSchema = new Schema<IDiscount>(
  {
    id: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: Object.values(DiscountType),
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    percentage: { type: Number, required: true },
    flatAmount: { type: Number },
    level: { type: String },
    promoCode: { type: String, unique: true },
    maxUsagePerUser: { type: Number, default: 1 },
    maxUsageGlobal: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const discountUsageSchema = new Schema<IDiscountUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    discountId: { type: Schema.Types.ObjectId, ref: "Discount", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    discountAmount: { type: Number, required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Discount = model<IDiscount>("Discount", discountSchema);
export const DiscountUsage = model<IDiscountUsage>("DiscountUsage", discountUsageSchema);
