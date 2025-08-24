// Order interfaces and types
import type {
  OrderItemType,
  OrderStatus,
  OrderType,
} from "@/enums/order.enum.js";
import type { Types } from "mongoose";

export interface IOrderItem {
  orderId: Types.ObjectId;
  menuItemId: Types.ObjectId;
  comboItemId: Types.ObjectId;
  quantity: number;
  price: number;
  type: OrderItemType;
}

export interface IOrder {
  id: string;
  user: Types.ObjectId;
  status: OrderStatus;
  discount?: Types.ObjectId;
  totalPrice: number;
  netPrice: number;
  type: OrderType;
  deliveryAddress?: string;
  payment?: Types.ObjectId;
  notes?: string;
  placedAt: Date;
  items: IOrderItem[];
}

export interface IOrderFilterOptions {
  searchTerm?: string;
  status?: OrderStatus;
  type?: OrderType;
  userId?: string;
}
