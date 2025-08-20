// Order routes
import validateRequest from "@/app/middlewares/req-validator.js";
import { Router } from "express";
import { OrderController } from "./order.controllers.js";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
import { createOrderSchema, updateOrderSchema } from "./order.validators.js";
const router = Router();

// GET /orders - paginated, filtered
router.get("/", auth(UserRole.ADMIN), OrderController.getOrders);

// GET /orders/:id
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderController.getOrderById
);

// GET /orders/customer/:customerId
router.get(
  "/customer/:customerId",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  OrderController.getOrdersByCustomerId
);

// POST /orders - customer only
router.post(
  "/",
  validateRequest(createOrderSchema),
  auth(UserRole.CUSTOMER),
  OrderController.createOrder
);

// PATCH /orders/:id - admin only
router.patch(
  "/:id",
  validateRequest(updateOrderSchema),
  auth(UserRole.ADMIN),
  OrderController.updateOrder
);

// Approve or reject order (admin only)
router.patch("/:id/approve", auth(UserRole.ADMIN), OrderController.approveOrder);

export const orderRoutes = router;
