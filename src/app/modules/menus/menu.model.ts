import { Schema, model } from "mongoose";
import type { IMenu } from "./menu.interface.js";
import { MenuLabel, MenuSize } from "@/enums/menu.enum.js";
import { slugify } from "@/utils/slugify.js";

const priceSchemaDef: Record<string, any> = {};
for (const size of Object.values(MenuSize))
  priceSchemaDef[size] = { type: Number, required: true };

const MenuSchema = new Schema<IMenu>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: priceSchemaDef,
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

// ✅ Generate slug before saving
MenuSchema.pre("validate", function (next) {
  if (this.isModified("name") || !this.slug) this.slug = slugify(this.name);
  next();
});

export const Menu = model<IMenu>("Menu", MenuSchema);
