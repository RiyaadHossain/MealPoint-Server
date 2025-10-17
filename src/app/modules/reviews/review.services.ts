// Review services
import { Review } from "./review.model.js";
import type { IReview } from "./review.interface.js";
import { User } from "../users/user.model.js";
import { UserRole } from "@/enums/user.enum.js";
import { IUser } from "../users/user.interface.js";
import { Types } from "mongoose";
import { Menu } from "../menus/menu.model.js";

/**
 * Get all reviews
 */
const getAllReviews = async (): Promise<IReview[]> => {
  return Review.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email level loyaltyPoints")
    .populate("menuId", "id name price")
    .populate("comboId", "id name price");
};

const getReviewsByProduct = async (productId: string): Promise<IReview[]> => {
  const menu = await Menu.findById(productId);
  if (menu) {
    const reviews = await Review.find({ menuId: productId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email level loyaltyPoints")
      .populate("menuId", "id name price")
      .populate("comboId", "id name price");
    
    return reviews;
  }

  const reviews = await Review.find({ comboId: productId })
    .sort({ createdAt: -1 })
    .populate("userId", "name email level loyaltyPoints")
    .populate("menuId", "id name price")
    .populate("comboId", "id name price");

  return reviews;
};

/**
 * Get best reviews (highest rating)
 */
const getBestReviews = async (): Promise<IReview[]> => {
  return Review.find()
    .sort({ rating: -1, createdAt: -1 })
    .limit(10)
    .populate("userId", "name email level loyaltyPoints")
    .populate("menuId", "id name price")
    .populate("comboId", "id name price");
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

const deleteReview = async (
  reviewId: string,
  userId: string
): Promise<void> => {
  const userExist = (await User.findOne({ id: userId })) as IUser & {
    _id: Types.ObjectId;
  };
  if (!userExist) throw new Error("User not found");

  const reviewExist = await Review.findById(reviewId);
  if (!reviewExist) throw new Error("Review not found");

  // Only the review owner or an admin can delete the review
  if (
    reviewExist.userId.toString() !== userExist._id.toString() &&
    userExist.role !== UserRole.ADMIN
  )
    throw new Error("Unauthorized to delete this review");

  await Review.findByIdAndDelete(reviewId);
};

export const ReviewService = {
  getAllReviews,
  getReviewsByProduct,
  getBestReviews,
  createReview,
  deleteReview,
};
