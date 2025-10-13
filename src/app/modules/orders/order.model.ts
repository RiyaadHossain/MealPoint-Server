// Order and OrderItem Mongoose models
import mongoose, { Schema } from "mongoose";
import type { IOrder, IOrderItem } from "./order.interface.js";
import { OrderItemType, OrderStatus, OrderType } from "@/enums/order.enum.js";
import { MenuSize } from "@/enums/menu.enum.js";

const OrderItemSchema = new Schema<IOrderItem>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  menuItemId: { type: Schema.Types.ObjectId, ref: "Menu" },
  comboItemId: { type: Schema.Types.ObjectId, ref: "Combo" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  size: { type: String, enum: MenuSize },
  type: {
    type: String,
    enum: Object.values(OrderItemType),
  },
});

const OrderSchema = new Schema<IOrder>({
  id: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
  discountUsage: { type: Schema.Types.ObjectId, ref: "DiscountUsage" },
  totalPrice: { type: Number, required: true },
  tax: { type: Number, required: true, default: 0 },
  netPrice: { type: Number },
  type: { type: String, enum: Object.values(OrderType), required: true },
  deliveryAddress: { type: String },
  payment: { type: Schema.Types.ObjectId, ref: "Payment" },
  notes: { type: String },
  placedAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
export const OrderItem = mongoose.model<IOrderItem>(
  "OrderItem",
  OrderItemSchema
);
