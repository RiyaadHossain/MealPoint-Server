import { paginationHelpers } from "@/helper/paginationHelper.js";
import type { SortOrder } from "mongoose";
import { Payment } from "./payment.model.js";
import type { IPaginationType } from "@/interfaces/paginaiton.js";
import type {
  IPaymentFilterOptions,
  IUpdatePaymentPayload,
} from "./payment.interface.js";
import { actualFilterField } from "@/utils/format-text.js";
import { rangeEnd, rangeStart } from "@/constants/range.query.js";
import { isMongoObjectId } from "@/utils/mongodb.js";
import mongoose from "mongoose";
import { Order, OrderItem } from "../orders/order.model.js";
import ApiError from "@/errors/ApiError.js";
import httpStatus from "http-status";
import { User } from "../users/user.model.js";
import { PaymentStatus } from "@/enums/payment.enum.js";
import { OrderStatus } from "@/enums/order.enum.js";
import config from "@/config/index.js";
import { stripe } from "@/config/payment.js";
import { NotificationService } from "../notifications/notification.services.js";
import { getAdminsId } from "../auth/auth.utils.js";
import { NotificationType } from "@/enums/notification-type.enum.js";
import { NotificationEvents } from "../notifications/notification.constants.js";

// Stripe Doc: https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=embedded-components
const createPayment = async (userId: string, payload: any) => {
  // 1️⃣ Validate order
  const order = await Order.findById(payload.orderId);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  const orderItems = await OrderItem.find({ orderId: order._id }).populate(
    "menuItemId comboItemId"
  );

  // 2️⃣ Validate user
  const user = await User.findOne({ id: userId });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User account not found");

  // 3️⃣ Generate transaction reference
  const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const line_items = orderItems.map((item: any) => {
    const name = item?.menuItemId?.name || item?.comboItemId?.name;
    const images = item?.menuItemId?.image || item?.comboItemId?.image;
    const description =
      item?.menuItemId?.description || item?.comboItemId?.description;

    return {
      price_data: {
        currency: "usd", // optionally make dynamic per restaurant
        product_data: {
          name,
          images: [images],
          description,
        },
        unit_amount: Math.round(item.price * 100), // amount in cents
      },
      quantity: item.quantity,
    };
  });

  // 4️⃣ Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "custom", // Custom checkout
    line_items,
    mode: "payment",
    return_url: `${config.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    // success_url: `${config.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    // cancel_url: `${config.CLIENT_URL}/payment-cancel`,
  });

  // 5️⃣ Save payment record in your DB
  const payment = await Payment.create({
    userId: user._id,
    orderId: order._id,
    amount: payload.amount,
    method: payload.method || "stripe",
    status: PaymentStatus.PENDING,
    transactionId,
    stripeSessionId: session.id, // save for later verification
  });

  // 6️⃣ Return session info to frontend
  return {
    payment,
    checkoutSession: {
      id: session.id,
      clientSecret: session.client_secret, // frontend can use this to open embedded checkout
      url: session.url, // optional, for redirect fallback
    },
  };
};

const getPaymentById = async (id: string) => {
  const payment = await Payment.findById(id).populate("userId orderId");
  return payment;
};

const updatePaymentStatus = async (
  id: string,
  payload: IUpdatePaymentPayload
) => {
  // 1. Find payment
  const payment = await Payment.findById(id);
  if (!payment) throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");

  const order = await Order.findById(payment.orderId);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

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
  payment.status =
    payload.status === PaymentStatus.SUCCESS
      ? PaymentStatus.SUCCESS
      : PaymentStatus.FAILED;
  await payment.save();

  // 4. Update order if payment is completed
  if (payload.status === PaymentStatus.SUCCESS) {
    await Order.findByIdAndUpdate(payment.orderId, {
      status: OrderStatus.PAID,
    });

    const adminsId = await getAdminsId();

    await Promise.all(
      adminsId.map(async (adminId) => {
        // create notification for admin
        await NotificationService.createNotificationForEvent(
          adminId,
          NotificationType.ADMIN_EVENT,
          {
            title: "Payment Confirmed 💳",
            message: `Payment successful for order id: ${order.id}`,
          }
        );
      })
    );

    await NotificationService.createNotificationForEvent(
      order.user,
      NotificationType.USER_EVENT,
      NotificationEvents.PAYMENT_SUCCESS
    );
  }

  const session = await stripe.checkout.sessions.retrieve(payload.session_id);

  return {
    payment,
    checkoutSession: {
      id: session.id,
      clientSecret: session.client_secret,
      url: session.url,
    },
  };
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
    .populate("userId orderId")
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
