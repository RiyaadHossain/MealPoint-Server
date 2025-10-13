// Order service functions
import { Order, OrderItem } from "./order.model.js";
import type {
  IOrder,
  IOrderFilterOptions,
  IOrderPayload,
} from "./order.interface.js";
import { generateOrderId } from "@/utils/order-id.js";
import type { IPaginationType } from "@/interfaces/paginaiton.js";
import { paginationHelpers } from "@/helper/paginationHelper.js";
import { orderSearchableFields } from "./order.constants.js";
import { rangeEnd, rangeStart } from "@/constants/range.query.js";
import { actualFilterField } from "@/utils/format-text.js";
import { isMongoObjectId } from "@/utils/mongodb.js";
import mongoose from "mongoose";
import { User } from "../users/user.model.js";
import { Menu } from "../menus/menu.model.js";
import { OrderItemType, OrderStatus } from "@/enums/order.enum.js";
import { Combo } from "../combos/combo.model.js";
import { NotificationService } from "../notifications/notification.services.js";
import { getAdminsId } from "../auth/auth.utils.js";
import { NotificationType } from "@/enums/notification-type.enum.js";
import { NotificationEvents } from "../notifications/notification.constants.js";
import { DiscountService } from "../discounts/discount.services.js";
import ApiError from "@/errors/ApiError.js";
import httpStatus from "http-status";
import { getTaxAmount } from "./order.utils.js";

/**
 * Get paginated and filtered orders
 */
const getOrders = async (
  paginationOptions: IPaginationType,
  filtersOptions: IOrderFilterOptions
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const sortCondition: { [key: string]: any } = {};
  sortCondition[sortBy] = sortOrder;

  const { searchTerm, ...filtersData } = filtersOptions;
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: orderSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field.startsWith(rangeStart))
          return { [actualFilterField(field, rangeStart)]: { $gte: value } };
        if (field.startsWith(rangeEnd))
          return { [actualFilterField(field, rangeEnd)]: { $lte: value } };
        if (isMongoObjectId(value))
          return { [field]: new mongoose.Types.ObjectId(value) };
        return { [field]: value };
      }),
    });
  }

  const whereCondition = Object.keys(andCondition).length
    ? { $and: andCondition }
    : {};

  const data = await Order.find(whereCondition)
    .populate("user")
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await Order.countDocuments(whereCondition);

  return {
    data,
    metaData: {
      total,
      page,
      limit,
    },
  };
};

/**
 * Get order by ID
 */
const getOrderById = async (orderId: string) => {
  // check if order exists
  let order = await Order.findOne({ id: orderId }).populate("user").lean();
  if (!order) throw new Error("Order not found");

  const orderItems = await OrderItem.find({ orderId: order._id }).populate([
    { path: "menuItemId" },
    { path: "comboItemId", populate: "items.item" },
  ]);

  // order = order.toObject(); // convert to plain object to add items
  order.items = orderItems;
  return order;
};

/**
 * Get orders by customer ID
 */
const getOrdersByCustomerId = async (customerId: string) => {
  // check customer exists
  const customerExists = await User.exists({ id: customerId });
  if (!customerExists) throw new Error("Customer not found");

  const orders = await Order.find({ user: customerExists._id }).lean();

  // populate order items and other related data
  await Promise.all(
    orders.map(async (order) => {
      const orderItems = await OrderItem.find({ orderId: order._id })
        .populate([
          { path: "menuItemId" },
          { path: "comboItemId", populate: "items.item" },
        ])
        .lean();
      order.items = orderItems;
    })
  );

  return orders;
};

/**
 * Create a new order
 */
const createOrder = async (userId: string, orderData: IOrderPayload) => {
  // check if user exists
  const userExists = await User.exists({ id: userId });
  if (!userExists) throw new Error("User not found");

  let totalPrice = 0;
  await Promise.all(
    orderData.items.map(async (item) => {

      // check if menu item or combo exists
      let itemExists = null;
      if (item.type === OrderItemType.MENU)
        itemExists = await Menu.findById(item.menuItemId);
      if (item.type === OrderItemType.COMBO)
        itemExists = await Combo.findById(item.comboItemId);

      if (!itemExists)
        throw new Error(
          `Menu item ${item.menuItemId || item.comboItemId} not found`
        );

      // Update total sold for menu or combo item
      itemExists.totalSold += item.quantity;
      await itemExists.save(); 

      // Calculate price
      if (item.type === OrderItemType.MENU && item.hasVariations) {
        // @ts-ignore
        const variant = itemExists.variations?.find((v: any) => v.size === item.size);
        
        if (!variant)
          throw new Error(
            `Variant ${item.size} not found for menu item ${item.menuItemId}`
          );
        
        item.price = variant.price * item.quantity; // set price from variant

        // @ts-ignore
      } else item.price = itemExists.basePrice * item.quantity; // set price from menu item

      totalPrice += item.price;
    })
  );

  orderData.id = await generateOrderId();
  orderData.totalPrice = totalPrice;
  orderData.user = userExists._id;

  const order = await Order.create(orderData);
  if (!order)
    throw new ApiError(httpStatus.BAD_REQUEST, "Internal Server Error");

  let discountAmount = 0;
  if (orderData.discountId) {
    const discount = await DiscountService.applyDiscount(
      order._id,
      orderData.discountId,
      userId
    );
    discountAmount = discount.discountAmount;
    order.discount = discount._id;
  }

  order.netPrice = totalPrice - discountAmount;
  order.tax = await getTaxAmount(order.netPrice);
  order.netPrice += order.tax;

  // create order items
  await Promise.all(
    orderData.items.map(async (item) => {
      item.orderId = order._id;
      await OrderItem.create(item);
    })
  );

  const adminsId = await getAdminsId();

  await Promise.all(
    adminsId.map(async (adminId) => {
      // create notification for admin
      await NotificationService.createNotificationForEvent(
        adminId,
        NotificationType.ADMIN_EVENT,
        NotificationEvents.ORDER_CREATED_ADMIN
      );
    })
  );

  await order.save()
  return order;
};

/**
 * Update order (admin only)
 */
const updateOrder = async (orderId: string, updateData: Partial<IOrder>) => {
  const existingOrder = await Order.findOne({ id: orderId });
  if (!existingOrder) throw new Error("Order not found");
  const order = await Order.findOneAndUpdate({ id: orderId }, updateData, {
    new: true,
  });
  return order;
};

/**
 * Approve or reject an order (admin only)
 */
const approveOrder = async (orderId: string, status: OrderStatus) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  order.status = status;
  await order.save();

  // Send notification to customer
  const user = await User.findById(order.user);
  if (!user) throw new Error("User not found");

  const notificationEvent =
    status === OrderStatus.APPROVED
      ? NotificationEvents.ORDER_PROCEEDED
      : NotificationEvents.ORDER_REJECTED;

  await NotificationService.createNotificationForEvent(
    // @ts-ignore
    user._id,
    NotificationType.USER_EVENT,
    notificationEvent
  );

  return order;
};

export const OrderService = {
  getOrders,
  getOrderById,
  getOrdersByCustomerId,
  createOrder,
  updateOrder,
  approveOrder,
};
