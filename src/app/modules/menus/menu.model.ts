import { Schema, model } from "mongoose";
import type { IMenu } from "./menu.interface.js";
import { MenuLabel } from "@/enums/menu.enum.js";

const MenuSchema = new Schema<IMenu>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    totalSold: { type: Number, default: 0 },
    label: {
      type: String,
      enum: Object.values(MenuLabel),
      default: MenuLabel.NONE,
    },
    estimatedTime: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Menu = model<IMenu>("Menu", MenuSchema);
