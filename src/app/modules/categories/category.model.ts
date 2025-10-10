import { Schema, model } from "mongoose";
import type { ICategory } from "./category.interface.js";
import { slugify } from "@/utils/slugify.js";

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// ✅ Generate slug before saving
CategorySchema.pre("validate", function (next) {
  if (this.isModified("name") || !this.slug) this.slug = slugify(this.name);
  next();
});

export const Category = model<ICategory>("Category", CategorySchema);
