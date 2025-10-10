import { Schema, model } from "mongoose";
import type { IMenu } from "./menu.interface.js";
import { MenuLabel } from "@/enums/menu.enum.js";
import { slugify } from "@/utils/slugify.js";

const MenuSchema = new Schema<IMenu>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    totalSold: { type: Number, default: 0 },
    label: {
      type: String,
      enum: Object.values(MenuLabel),
      default: MenuLabel.REGULAR,
    },
    slug: { type: String, required: true, unique: true },
    estimatedTime: { type: Number, required: true },
  },
  { timestamps: true }
);

// ✅ Generate slug before saving
MenuSchema.pre("validate", function (next) {
  if (this.isModified("name") || !this.slug) 
    this.slug = slugify(this.name);
  next();
});

export const Menu = model<IMenu>("Menu", MenuSchema);
