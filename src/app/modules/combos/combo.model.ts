import { Schema, model } from "mongoose";
import type { ICombo } from "./combo.interface.js";

const ComboItemSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, min: 0 },
});

const ComboSchema = new Schema<ICombo>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    totalPrice: { type: Number, required: true, min: 0 },
    image: { type: String },
    items: { type: [ComboItemSchema], required: true },
    isAvailable: { type: Boolean, default: true },
    estimatedTime: { type: String },
  },
  { timestamps: true }
);

export const Combo = model<ICombo>("Combo", ComboSchema);
