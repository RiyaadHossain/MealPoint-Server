// settings.services.ts

import type { IAdminSetting } from "./setting.interface.js";
import { AdminSettings } from "./setting.model.js";

const getSetting = async (key: string): Promise<IAdminSetting | null> => {
  return AdminSettings.findOne({ key });
};

const createSetting = async (
  key: string,
  value: string
): Promise<IAdminSetting> => {
  return AdminSettings.create({ key, value });
};

const updateSetting = async (
  key: string,
  value: string
): Promise<IAdminSetting> => {
  return AdminSettings.findOneAndUpdate(
    { key },
    { value },
    { new: true, upsert: true }
  );
};

const getAllSettings = async (): Promise<IAdminSetting[]> => {
  return AdminSettings.find({});
};

export const AdminSettingsService = {
  getSetting,
  createSetting,
  updateSetting,
  getAllSettings,
};
