// Order status and type enums
export enum OrderStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PAID = "paid",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum OrderType {
  DINE_IN = "dine-in",
  DELIVERY = "delivery",
  TAKEAWAY = "takeaway",
}

export enum OrderItemType {
  MENU = "menu",
  COMBO = "combo",
  SPECIAL = "special",
}