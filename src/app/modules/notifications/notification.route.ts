// Notification routes
import express from "express";
import { NotificationController } from "./notification.controllers.js";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";

const router = express.Router();

// Get all notifications
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  NotificationController.getNotifications
);

// Mark notification as read
router.patch(
  "/:id/read",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  NotificationController.markAsRead
);

// Mark all notifications as read
router.patch(
  "/read-all",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  NotificationController.markAllAsRead
);

export const NotificationRoutes = router;
