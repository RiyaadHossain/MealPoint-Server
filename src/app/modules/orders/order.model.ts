// Order and OrderItem Mongoose models
import mongoose, { Schema } from "mongoose";
import type { IOrder, IOrderItem } from "./order.interface.js";
import { OrderItemType, OrderStatus, OrderType } from "@/enums/order.enum.js";

const OrderItemSchema = new Schema<IOrderItem>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  menuItemId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
  comboItemId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
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
  discount: { type: Schema.Types.ObjectId, ref: "Discount" },
  totalPrice: { type: Number, required: true },
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
