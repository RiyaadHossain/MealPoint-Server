// Notification service functions
import { Notification } from "./notification.model.js";
import type { INotification } from "./notification.interface.js";
import type { NotificationType } from "@/enums/notification-type.enum.js";
import mongoose from "mongoose";
import type { IPaginationType } from "@/interfaces/paginaiton.js";
import { paginationHelpers } from "@/helper/paginationHelper.js";
import { User } from "../users/user.model.js";

/**
 * Get all notifications with pagination only
 */
const getNotifications = async (
  userId: string,
  paginationOptions: IPaginationType
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const user = await User.findOne({ id: userId });
  const notifications = await Notification.find({ userId: user?._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Notification.countDocuments({});

  return {
    data: notifications,
    meta: {
      total,
      page,
      limit,
    },
  };
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId: string) => {
  const user = await User.findOne({ id: userId });
  if (!user) throw new Error("User not found");
  await Notification.updateMany(
    { userId: user._id, read: false },
    { read: true }
  );
  return;
};

/**
 * Mark a notification as read
 */
const markAsRead = async (id: string) => {
  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
  return notification;
};

/**
 * Create a notification for a specific event
 */
const createNotificationForEvent = async (
  userId: string,
  type: NotificationType,
  event: { title: string; message: string }
) => {
  if (!event) throw new Error("Invalid notification event");

  const notification: Partial<INotification> = {
    userId: new mongoose.Types.ObjectId(userId),
    type,
    title: event.title,
    message: event.message,
    read: false,
  };
  return await Notification.create(notification);
};

export const NotificationService = {
  getNotifications,
  markAsRead,
  createNotificationForEvent,
  markAllAsRead,
};
