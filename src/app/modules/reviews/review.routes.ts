// Review routes
import auth from "@/app/middlewares/auth.js";
import express from "express";
import { ReviewController } from "./review.controllers.js";
import validateRequest from "@/app/middlewares/req-validator.js";
import { createReviewZodSchema } from "./review.validators.js";
import { UserRole } from "@/enums/user.enum.js";

const router = express.Router();

// Get all reviews
router.get("/", ReviewController.getAllReviews);

router.get("/product/:productId", ReviewController.getReviewsByProduct);

// Get best reviews
router.get("/best", ReviewController.getBestReviews);

// Create a review
router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview
);

router.delete("/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN), ReviewController.deleteReview);

export const ReviewRoutes = router;
