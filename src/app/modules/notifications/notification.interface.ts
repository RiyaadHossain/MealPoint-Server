// Notification interface and types

import type { NotificationType } from "@/enums/notification-type.enum.js";
import type { Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationFilterOptions {
  userId?: string;
  type?: NotificationType;
  read?: boolean;
  searchTerm?: string;
}
