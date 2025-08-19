// Review routes
import auth from "@/app/middlewares/auth.js";
import express from "express";
import { ReviewController } from "./review.controllers.js";
import validateRequest from "@/app/middlewares/req-validator.js";
import { createReviewZodSchema } from "./review.validators.js";
import { UserRole } from "@/enums/user.enum.js";

const router = express.Router();

// Get all reviews
router.get("/", auth(UserRole.CUSTOMER, UserRole.ADMIN), ReviewController.getAllReviews);

// Get best reviews
router.get("/best", auth(UserRole.CUSTOMER, UserRole.ADMIN), ReviewController.getBestReviews);

// Create a review
router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview
);

export const ReviewRoutes = router;
