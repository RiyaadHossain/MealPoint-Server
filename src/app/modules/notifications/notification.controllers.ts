/**
 * Mark all notifications as read for the current user
 */
const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.["_id"] as string;
  const result = await NotificationService.markAllAsRead(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All notifications marked as read",
    data: result,
  });
});
// Notification controller functions
import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import { NotificationService } from "./notification.services.js";
import pick from "@/shared/pick.js";
import { paginationFields } from "@/constants/pagination.js";

/**
 * Get all notifications
 */
const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const userId = req?.user?.["_id"] as string;
  const response = await NotificationService.getNotifications(
    userId,
    paginationOptions
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notifications retrieved successfully",
    data: response.data,
    meta: response.meta,
  });
});

/**
 * Mark notification as read
 */
const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notificationId = req.params["id"] as string;
  const notification = await NotificationService.markAsRead(notificationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notification marked as read",
    data: notification,
  });
});

export const NotificationController = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
