// Order status and type enums
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
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