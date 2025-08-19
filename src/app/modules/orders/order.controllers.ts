// Order controller functions
import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import { OrderService } from "./order.services.js";
import pick from "@/shared/pick.js";
import { paginationFields } from "@/constants/pagination.js";
import { orderFilterableFields } from "./order.constants.js";

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filterOptions = pick(req.query, orderFilterableFields);
  const response = await OrderService.getOrders(
    paginationOptions,
    filterOptions
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: response.data,
    meta: response.metaData,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params["id"] as string;
  const order = await OrderService.getOrderById(orderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: order,
  });
});

/**
 * Get orders by customer ID
 */
const getOrdersByCustomerId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.["id"] as string;
    const orders = await OrderService.getOrdersByCustomerId(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Orders for customer retrieved successfully",
      data: orders,
    });
  }
);

/**
 * Create a new order (customer only)
 */
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const userId = req?.user?.["id"] as string;
  const order = await OrderService.createOrder(userId, orderData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order created successfully",
    data: order,
  });
});

/**
 * Update order (admin only)
 */
const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const orderId = req.params["id"] as string;
  const order = await OrderService.updateOrder(orderId, orderData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order updated successfully",
    data: order,
  });
});

export const OrderController = {
  getOrders,
  getOrderById,
  getOrdersByCustomerId,
  createOrder,
  updateOrder,
};
