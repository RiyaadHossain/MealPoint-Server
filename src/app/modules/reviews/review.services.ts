// Review services
import { Review } from "./review.model.js";
import type { IReview } from "./review.interface.js";
import { User } from "../users/user.model.js";

/**
 * Get all reviews
 */
const getAllReviews = async (): Promise<IReview[]> => {
  return Review.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email level loyaltyPoints")
    .populate("orderId");
};

/**
 * Get best reviews (highest rating)
 */
const getBestReviews = async (): Promise<IReview[]> => {
  return Review.find()
    .sort({ rating: -1, createdAt: -1 })
    .limit(10)
    .populate("userId", "name email level loyaltyPoints")
    .populate({path: "orderId"});
};

/**
 * Create a new review
 */
const createReview = async (
  userId: string,
  review: IReview
): Promise<IReview> => {
  const customerExist = await User.findOne({ id: userId });
  if (!customerExist) throw new Error("Customer not found");

  review.userId = customerExist._id as string;
  return Review.create(review);
};

export const ReviewService = {
  getAllReviews,
  getBestReviews,
  createReview,
};
