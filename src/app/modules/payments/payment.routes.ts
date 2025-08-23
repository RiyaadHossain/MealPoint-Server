import validateRequest from "@/app/middlewares/req-validator.js";
import express from "express";
import {
  createPaymentSchema,
  updatePaymentStatusSchema,
} from "./payment.validation.js";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
import { PaymentController } from "./payment.controllers.js";

const router = express.Router();

router.post(
  "/initiate",
  validateRequest(createPaymentSchema),
  auth(UserRole.CUSTOMER),
  PaymentController.createPayment
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  PaymentController.getPaymentById
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  validateRequest(updatePaymentStatusSchema),
  PaymentController.updatePaymentStatus
);

router.get("/", PaymentController.getAllPayments); // Admin - Get all payments
router.get("/user/:userId", PaymentController.getUserPaymentHistory); // Customer - Get payment history

export const PaymentRoutes = router;
