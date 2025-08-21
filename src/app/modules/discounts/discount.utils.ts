// Utility functions for discount module
import type { IDiscount } from "./discount.interface.js";
import { DiscountUsage } from "./discount.model.js";

// Check if discount is currently active
export function isDiscountActive(startDate?: Date, endDate?: Date): boolean {
  const now = new Date();
  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;
  return true;
}

export async function isFirstOrderOfferAvailable(userId: any, discountId: any) {
  const discountCount = await DiscountUsage.find({
    userId,
    discountId,
  }).countDocuments();
  return !discountCount;
}

export function isSessionalOfferValid(discount: IDiscount) {
  const now = new Date();
  if (!discount.startDate || !discount.endDate) return false;
  return now >= discount.startDate && now <= discount.endDate;
}

export async function isPromoDiscountAvailable(userId: any, discountId: any) {
  const usageCount = await DiscountUsage.find({
    userId,
    discountId,
  }).countDocuments();

  return !usageCount;
}

export async function firstOrderOfferTaken(userId: any, discountId: any) {
  const discountUsage = await DiscountUsage.findOne({
    userId,
    discountId,
  }).countDocuments();
  return !!discountUsage;
}

export function calcDiscount(
  totalAmount: number,
  percentage: number
) {
  if (percentage <= 0) return 0;
  const discount = (totalAmount * percentage) / 100;
  // Ensure discount is not negative and does not exceed totalAmount
  return Math.max(0, Math.min(discount, totalAmount));
}
