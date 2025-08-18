import { Schema, model } from "mongoose";
import type { ICategory } from "./category.interface.js";

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", CategorySchema);
