import { Discount } from "@/app/modules/discounts/discount.model.js";

export const generateDiscountId = async (): Promise<string> => {
  const lastDiscount = await Discount.findOne({ id: /^D-\d+$/ })
    .sort({ id: -1 })
    .select("id")
    .lean();
  
  let nextNumber = 101;
  if (lastDiscount && lastDiscount.id) {
    const match = lastDiscount.id.match(/^D-(\d+)$/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `D-${nextNumber}`;
};