// Notification Mongoose model
import mongoose, { Schema } from "mongoose";
import type { INotification } from "./notification.interface.js";
import { NotificationType } from "@/enums/notification-type.enum.js";

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
