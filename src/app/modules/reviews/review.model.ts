// Review Mongoose model
import { Schema, model } from "mongoose";
import type { IReview } from "./review.interface.js";

const reviewSchema = new Schema<IReview>({
  menuId: { type: String, ref: "Menu" },
  comboId: { type: String, ref: "Combo" },
  userId: { type: String, required: true, ref: "User" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Review = model<IReview>("Review", reviewSchema);
