import { User } from "../users/user.model.js";
import type { IDiscount, IDiscountFilterOptoins } from "./discount.interface.js";
import { Discount, DiscountUsage } from "./discount.model.js";
import { DiscountType } from "@/enums/discount.enum.js";
import {
  calcDiscount,
  firstOrderOfferTaken,
  isFirstOrderOfferAvailable,
  isPromoDiscountAvailable,
  isSessionalOfferValid,
} from "./discount.utils.js";
import { Order } from "../orders/order.model.js";
import type { IPaginationType } from "@/interfaces/paginaiton.js";
import { isMongoObjectId } from "@/utils/mongodb.js";
import mongoose, { type SortOrder } from "mongoose";
import { actualFilterField } from "@/utils/format-text.js";
import { discountSearchableFields } from "./discount.constants.js";
import { rangeEnd, rangeStart } from "@/constants/range.query.js";
import { paginationHelpers } from "@/helper/paginationHelper.js";

/**
 * Service functions for Discount operations
 */
const createDiscount = async (payload: IDiscount) => {
  return await Discount.create(payload);
};

const getDiscounts = async (
  paginationOptions: IPaginationType,
  filtersOptions: IDiscountFilterOptoins
) => {
    // Pagination Options
    const { skip, page, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions);
  
    // Sort condition
    const sortCondition: { [key: string]: SortOrder } = {};
    sortCondition[sortBy] = sortOrder;
  
    // Filter Options
    const { searchTerm, ...filtersData } = filtersOptions;
  
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: discountSearchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }
  
    if (Object.keys(filtersData).length) {
      andCondition.push({
        $and: Object.entries(filtersData).map(([field, value]) => {
          // Handle range queries
          if (field.startsWith(rangeStart))
            return { [actualFilterField(field, rangeStart)]: { $gte: value } };
  
          if (field.startsWith(rangeEnd))
            return { [actualFilterField(field, rangeEnd)]: { $lte: value } };
  
          // Handle ObjectId Query
          if (isMongoObjectId(value))
            // @ts-ignore
            return { [field]: new mongoose.Types.ObjectId(value) };
  
          return { [field]: value };
        }),
      });
    }
  
    const whereCondition = Object.keys(andCondition).length
      ? { $and: andCondition }
      : {};
  
    const data = await Discount.find(whereCondition).skip(skip).limit(limit).lean();
  
    const total = await Discount.countDocuments(whereCondition);
  
    const response = {
      data,
      metaData: {
        total,
        page,
        limit,
      },
    };
  
    return response;
};

const getDiscountById = async (id: string) => {
  return await Discount.findById(id);
};

const updateDiscount = async (id: string, payload: Partial<IDiscount>) => {
  return await Discount.findByIdAndUpdate(id, payload, { new: true });
};

const deleteDiscount = async (id: string) => {
  return await Discount.findByIdAndDelete(id);
};

const applyDiscount = async (
  orderId: string,
  discountId: string,
  discountType: DiscountType,
  userId: string
) => {
  const user = await User.findOne({ id: userId });
  if (!user) throw new Error("User not found");

  const discount = await Discount.findById(discountId);
  if (!discount) throw new Error("Discount not found");

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  const discountTaken = await DiscountUsage.findOne({
    userId: user._id,
    discountId,
  });

  const discountUsageData = {
    orderId,
    discountId,
    discountType,
    discountAmount: 0,
  };

  if (
    discountType === DiscountType.NEW_USER &&
    (await firstOrderOfferTaken(userId, discountId))
  )
    throw new Error("First order discount already taken");

  // if (discountType === DiscountType.LEVEL_BASED)

  if (discountType === DiscountType.SEASONAL) {
    if (!isSessionalOfferValid(discount))
      throw new Error("Sessional discount already expired");
    if (discountTaken) throw new Error("Discount already taken");
  }

  if (discountType === DiscountType.PROMO_CODE) {
    if (discountTaken) throw new Error("Discount already taken!");
  }

  discountUsageData["discountAmount"] = calcDiscount(
    order.totalPrice,
    discount.percentage
  );
  const newDiscountTaken = await DiscountUsage.create(discountUsageData);

  return newDiscountTaken;
};

const getAvailableDiscounts = async (id: string) => {
  const user = await User.findOne({ id });
  if (!user) throw new Error("User not found!");

  const userId = user?._id;
  const discounts = await Discount.find({ isActive: true });

  let available: any[] = [];

  for (let d of discounts) {
    let isEligible = false;

    // Todo: for first order there will a row in the table
    if (
      d.type === DiscountType.NEW_USER &&
      (await isFirstOrderOfferAvailable(userId, d._id))
    )
      isEligible = true;

    // Todo: for every level there will a row defining discount info
    if (d.type === DiscountType.LEVEL_BASED) {
      if (user.level === d.level) isEligible = true;
    }

    if (d.type === DiscountType.SEASONAL && isSessionalOfferValid(d))
      isEligible = true;

    if (
      d.type === DiscountType.PROMO_CODE &&
      (await isPromoDiscountAvailable(userId, d._id))
    )
      isEligible = true;

    if (isEligible) available.push(d);
  }

  return available;
};

export const DiscountService = {
  createDiscount,
  getDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  applyDiscount,
  getAvailableDiscounts,
};
