import { UserRole } from "@/enums/user.enum.js";
import { Combo } from "../combos/combo.model.js";
import { Order, OrderItem } from "../orders/order.model.js";
import { User } from "../users/user.model.js";
import { Menu } from "../menus/menu.model.js";
import { generateLabels, getEndtDate, getStartDate } from "./admin.utils.js";
import { OrderItemType, OrderStatus } from "@/enums/order.enum.js";

const getStatistics = async () => {
  const totalItems = await Menu.countDocuments();
  const totalCombos = await Combo.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalSales = await Order.aggregate([
    { $match: { status: OrderStatus.PAID } },
    { $group: { _id: null, sum: { $sum: "$totalPrice" } } },
  ]);

  const totalCustomers = await User.countDocuments({ role: UserRole.CUSTOMER });

  return {
    totalItems,
    totalCombos,
    totalOrders,
    totalSales: totalSales[0]?.sum || 0,
    totalCustomers,
  };
};

const getSalesSummary = async (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  /** 1. TOTAL SALES */
  const totalSalesResult = await Order.aggregate([
    {
      $match: {
        placedAt: { $gte: start, $lte: end },
        status: { $ne: OrderStatus.CANCELLED },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const totalSales = totalSalesResult[0]?.totalSales || 0;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date range");
  }

  /** 2. TOTAL ORDERS */
  const totalOrders = await Order.countDocuments({
    placedAt: { $gte: start, $lte: end },
    status: { $ne: OrderStatus.CANCELLED },
  });

  /** 3. AVERAGE ORDER VALUE */
  const averageOrderValue = totalOrders
    ? parseFloat((totalSales / totalOrders).toFixed(2))
    : 0;

  /** 4. BEST SELLING ITEMS */
  const bestSellingItems = await OrderItem.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    {
      $match: {
        "order.placedAt": { $gte: start, $lte: end },
        "order.status": { $ne: OrderStatus.CANCELLED },
        type: OrderItemType.MENU,
      },
    },
    {
      $group: {
        _id: "$menuItemId",
        unitsSold: { $sum: "$quantity" },
        revenue: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "menus",
        localField: "_id",
        foreignField: "_id",
        as: "menuItem",
      },
    },
    { $unwind: "$menuItem" },
    {
      $project: {
        id: "$menuItem.id",
        name: "$menuItem.name",
        unitsSold: 1,
        revenue: 1,
      },
    },
  ]);

  /** 5. BEST SELLING COMBOS */
  const bestSellingCombos = await OrderItem.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    {
      $match: {
        "order.placedAt": { $gte: start, $lte: end },
        "order.status": { $ne: OrderStatus.CANCELLED },
        type: OrderItemType.COMBO,
      },
    },
    {
      $group: {
        _id: "$comboItemId",
        unitsSold: { $sum: "$quantity" },
        revenue: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "combos",
        localField: "_id",
        foreignField: "_id",
        as: "combo",
      },
    },
    { $unwind: "$combo" },
    {
      $project: {
        id: "$combo.id",
        name: "$combo.name",
        unitsSold: 1,
        revenue: 1,
      },
    },
  ]);

  /** 6. PEAK HOURS */
  const peakHours = await Order.aggregate([
    {
      $match: {
        placedAt: { $gte: start, $lte: end },
        status: { $ne: OrderStatus.CANCELLED },
      },
    },
    {
      $group: {
        _id: { hour: { $hour: "$placedAt" } },
        orders: { $sum: 1 },
      },
    },
    { $sort: { orders: -1 } },
    { $limit: 5 },
  ]).then((res) =>
    res.map((h) => ({
      hour: `${String(h._id.hour).padStart(2, "0")}:00-${String(
        (h._id.hour + 1) % 24
      ).padStart(2, "0")}:00`,
      orders: h.orders,
    }))
  );

  return {
    totalSales,
    totalOrders,
    averageOrderValue,
    bestSellingItems,
    bestSellingCombos,
    peakHours,
  };
};

const getSalesOrdersStatistics = async (
  period: "day" | "month",
  range: number
) => {
  const labels = generateLabels(period, range);

  const data = await Promise.all(
    labels.map(async (label) => {
      const startDate = getStartDate(period, label);
      const endDate = getEndtDate(period, label);

      const stats = await Order.aggregate([
        {
          $match: {
            placedAt: { $gte: startDate, $lte: endDate },
            status: OrderStatus.PAID,
          },
        },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            sales: { $sum: "$totalPrice" },
          },
        },
      ]);

      const orders = stats.length ? stats[0].orders : 0;
      const sales = stats.length ? stats[0].sales : 0;

      return { label, orders, sales };
    })
  );

  return { period, data };
};

export const AdminService = {
  getStatistics,
  getSalesSummary,
  getSalesOrdersStatistics,
};
