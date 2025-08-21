import { paginationHelpers } from "@/helper/paginationHelper.js";
import type { SortOrder } from "mongoose";
import { Payment } from "./payment.model.js";
import type { IPaginationType } from "@/interfaces/paginaiton.js";
import type { IPaymentFilterOptions } from "./payment.interface.js";
import { actualFilterField } from "@/utils/format-text.js";
import { rangeEnd, rangeStart } from "@/constants/range.query.js";
import { isMongoObjectId } from "@/utils/mongodb.js";
import mongoose from "mongoose";
import { Order } from "../orders/order.model.js";
import ApiError from "@/errors/ApiError.js";
import httpStatus from "http-status";
import { User } from "../users/user.model.js";
import { PaymentStatus } from "@/enums/payment.enum.js";
import { OrderStatus } from "@/enums/order.enum.js";

const createPayment = async (userId: string, payload: any) => {
  // 1. Validate order
  const order = await Order.findById(payload.orderId);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

  //   if (order.totalPrice !== payload.amount) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, "Amount mismatch");
  //   }

  // 2. Validate order
  const user = await User.findOne({ id: userId });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User account not found");

  // 3. Generate transaction reference
  const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // ToDo: initiate third-party transaction

  // 4. Create payment record
  const payment = await Payment.create({
    userId: user._id,
    orderId: payload.orderId,
    amount: payload.amount,
    method: payload.method,
    status: "PENDING", // or COMPLETED for COD
    transactionId,
  });

  return payment;
};

const getPaymentById = async (id: string) => {
  const payment = await Payment.findById(id).populate("userId orderId");
  return payment;
};

const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
  // 1. Find payment
  const payment = await Payment.findById(id);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  // 2. Prevent updating if final state
  const finalStatus = [
    PaymentStatus.SUCCESS,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELLED,
  ];
  if (finalStatus.includes(payment.status)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payment status cannot be changed once finalized"
    );
  }

  // 3. Update payment status
  payment.status = status;
  await payment.save();

  // 4. Update order if payment is completed
  if (status === PaymentStatus.SUCCESS) {
    await Order.findByIdAndUpdate(payment.orderId, {
      status: OrderStatus.PAID,
    });
  }

  return payment;
};

const getAllPayments = async (
  paginationOptions: IPaginationType,
  filterOptions: IPaymentFilterOptions
) => {
  // Pagination Options
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Sort condition
  const sortCondition: { [key: string]: SortOrder } = {};
  sortCondition[sortBy] = sortOrder;

  // Filter Options
  const { searchTerm, ...filtersData } = filterOptions;

  const andCondition = [];

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
          return { [field]: new mongoose.Types.ObjectId(value) };

        return { [field]: value };
      }),
    });
  }

  const whereCondition = Object.keys(andCondition).length
    ? { $and: andCondition }
    : {};

  const data = await Payment.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Payment.countDocuments(whereCondition);

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

const getUserPaymentHistory = async (
  userId: string,
  paginationOptions: any
) => {
  // Pagination Options
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Sort condition
  const sortCondition: { [key: string]: SortOrder } = {};
  sortCondition[sortBy] = sortOrder;

  const query = { userId };
  const data = await Payment.find(query).skip(skip).limit(limit).lean();

  const total = await Payment.countDocuments(query);

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

export const PaymentService = {
  createPayment,
  getPaymentById,
  updatePaymentStatus,
  getAllPayments,
  getUserPaymentHistory,
};
