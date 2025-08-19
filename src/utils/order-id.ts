// Utility to generate unique order IDs
import { Order } from "@/app/modules/orders/order.model.js";

export const generateOrderId = async (): Promise<string> => {
  // Example: ORD-00001, incrementing
  const lastOrder = await Order.findOne({}, {}, { sort: { id: -1 } });
  let nextId = "ORD-00001";
  if (lastOrder && lastOrder.id) {
    const lastNum = parseInt(lastOrder.id.split("-")[1], 10);
    nextId = `ORD-${(lastNum + 1).toString().padStart(5, "0")}`;
  }
  return nextId;
};
