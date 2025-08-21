import auth from "@/app/middlewares/auth.js";
import validateRequest from "@/app/middlewares/req-validator.js";
import express from "express";
import { DiscountController } from "./discount.controllers.js";
import { UserRole } from "@/enums/user.enum.js";
import {
  createDiscountSchema,
  updateDiscountSchema,
  applyDiscountSchema,
} from "./discount.validators.js";

const router = express.Router();

// Create a discount
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(createDiscountSchema),
  DiscountController.createDiscount
);

// List all discounts
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  DiscountController.getDiscounts
);

// Get a single discount by ID
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  DiscountController.getDiscountById
);

// Update a discount
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(updateDiscountSchema),
  DiscountController.updateDiscount
);

// Delete a discount
router.delete("/:id", auth(UserRole.ADMIN), DiscountController.deleteDiscount);

// Apply discount to an order
router.post(
  "/apply",
  auth(UserRole.CUSTOMER),
  validateRequest(applyDiscountSchema),
  DiscountController.applyDiscount
);

// Get available discounts for user
router.get(
  "/available",
  auth(UserRole.CUSTOMER),
  DiscountController.getAvailableDiscounts
);

export default router;
