import { Schema, model } from "mongoose";
import type { IMenu } from "./menu.interface.js";
import { MenuLabel, MenuSize } from "@/enums/menu.enum.js";
import { slugify } from "@/utils/slugify.js";
import ApiError from "@/errors/ApiError.js";
import httpStatus from "http-status";

const variationSchema = new Schema(
  {
    size: {
      type: String,
      enum: Object.values(MenuSize),
      required: true,
    },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const MenuSchema = new Schema<IMenu>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    basePrice: { type: Number }, // used when hasVariants = false
    variations: { type: [variationSchema], default: [] },
    hasVariants: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    totalSold: { type: Number, default: 0 },
    label: {
      type: String,
      enum: Object.values(MenuLabel),
      default: MenuLabel.REGULAR,
    },
    tags: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true },
    estimatedTime: { type: Number, required: true },
  },
  { timestamps: true }
);

MenuSchema.pre("validate", function (next) {
  // ✅ Validation to prevent both basePrice and variations
  const hasBase = !!this.basePrice;
  const hasVar = (this.variations?.length ?? 0) > 0;
  if (hasBase && hasVar)
    return next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        "Menu item cannot have both basePrice and variations"
      )
    );

  if (!hasBase && !hasVar)
    return next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        "Menu item must have either basePrice or variations"
      )
    );

  // ✅ Generate slug before saving
  if (this.isModified("name") || !this.slug) this.slug = slugify(this.name);
  next();
});

export const Menu = model<IMenu>("Menu", MenuSchema);
