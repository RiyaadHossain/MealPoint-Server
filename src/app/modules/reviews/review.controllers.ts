// Review controllers
import type { Request, Response } from "express";
import { ReviewService } from "./review.services.js";
import sendResponse from "@/shared/send-response.js";

/**
 * Get all reviews
 */
const getAllReviews = async (_req: Request, res: Response) => {
  const reviews = await ReviewService.getAllReviews();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews fetched successfully",
    data: reviews,
  });
};

const getReviewsByProduct = async (req: Request, res: Response) => {
  const productId = req.params["productId"] as string;
  const reviews = await ReviewService.getReviewsByProduct(productId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product reviews fetched successfully",
    data: reviews,
  });
};

/**
 * Get best reviews
 */
const getBestReviews = async (_req: Request, res: Response) => {
  const reviews = await ReviewService.getBestReviews();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Best reviews fetched successfully",
    data: reviews,
  });
};

/**
 * Create a review
 */
const createReview = async (req: Request, res: Response) => {
  const userId = req.user?.["id"];
  const review = await ReviewService.createReview(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: review,
  });
};

const deleteReview = async (req: Request, res: Response) => {
  const reviewId = req.params["id"] as string;
  const userId = req.user?.["id"] as string;

  await ReviewService.deleteReview(reviewId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
  });
};

export const ReviewController = {
  getAllReviews,
  getReviewsByProduct,
  getBestReviews,
  createReview,
  deleteReview,
};
