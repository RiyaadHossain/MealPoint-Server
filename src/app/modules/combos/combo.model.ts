import { Schema, model } from "mongoose";
import type { ICombo } from "./combo.interface.js";
import { slugify } from "@/utils/slugify.js";
import { MenuSize } from "@/enums/menu.enum.js";

const ComboItemSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
  hasVariants: { type: Boolean, default: false },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, min: 0 },
  size: { type: String, enum: MenuSize, required: true },
});

const ComboSchema = new Schema<ICombo>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true, min: 0 },
    image: { type: String },
    totalSold: { type: Number, default: 0 },
    items: { type: [ComboItemSchema], required: true },
    isAvailable: { type: Boolean, default: true },
    estimatedTime: { type: String },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// ✅ Generate slug before saving
ComboSchema.pre("validate", function (next) {
  if (this.isModified("name") || !this.slug) this.slug = slugify(this.name);
  next();
});

export const Combo = model<ICombo>("Combo", ComboSchema);
