// Order interfaces and types
import { MenuSize } from "@/enums/menu.enum.js";
import type {
  OrderItemType,
  OrderStatus,
  OrderType,
} from "@/enums/order.enum.js";
import type { Types } from "mongoose";

export interface IOrderItem {
  orderId: Types.ObjectId;
  menuItemId?: Types.ObjectId;
  comboItemId?: Types.ObjectId;
  quantity: number;
  price: number;
  size?: MenuSize;
  type: OrderItemType;
  hasVariations?: boolean; // Not stored in DB, used for avoid typescript errors
}

export interface IOrder {
  id: string;
  user: Types.ObjectId;
  status: OrderStatus;
  discountUsage?: Types.ObjectId;
  totalPrice: number;
  tax: number;
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

export type IOrderPayload = IOrder & {
  items: (IOrderItem & { hasVariations: boolean })[];
  type: OrderType;
  deliveryAddress?: string;
  notes?: string;
  discountId?: string;
};
