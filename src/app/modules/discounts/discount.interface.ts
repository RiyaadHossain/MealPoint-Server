import type { DiscountType } from "@/enums/discount.enum.js";
import { Types } from "mongoose";

// Interface for Discount document
export interface IDiscount {
  id: string;
  type: DiscountType;
  title: string;
  description?: string;
  percentage: number;
  flatAmount?: number;
  level?: string;
  promoCode?: string;
  maxUsagePerUser?: number;
  maxUsageGlobal?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  createdBy?: Types.ObjectId;
}

export interface IDiscountUsage {
  userId: Types.ObjectId;
  discountId: Types.ObjectId;
  orderId: Types.ObjectId;
  usedAt: Date;
  discountAmount: number;
}

export interface IDiscountFilterOptoins {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  type?: DiscountType;
  percentage?: number;
  isActive?: boolean
}
