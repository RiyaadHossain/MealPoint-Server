// settings.model.ts
import { Schema, model } from "mongoose";
import type { IAdminSetting } from "./setting.interface.js";


const adminSettingsSchema = new Schema<IAdminSetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

export const AdminSettings = model<IAdminSetting>("AdminSettings", adminSettingsSchema);
