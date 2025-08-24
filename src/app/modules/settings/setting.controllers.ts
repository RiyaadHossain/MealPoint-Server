// settings.controllers.ts
import type { Request, Response } from "express";
import sendResponse from "@/shared/send-response.js";
import { AdminSettingsService } from "./setting.services.js";

const getAllSettings = async (_req: Request, res: Response) => {
  const settings = await AdminSettingsService.getAllSettings();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All settings fetched",
    data: settings,
  });
};

const createSetting = async (req: Request, res: Response) => {
  const { key, value } = req.body;
  const updated = await AdminSettingsService.createSetting(key, value);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `${key} updated successfully`,
    data: updated,
  });
};

const updateSetting = async (req: Request, res: Response) => {
  const { key, value } = req.body;
  const updated = await AdminSettingsService.updateSetting(key, value);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `${key} updated successfully`,
    data: updated,
  });
};

export const AdminSettingsController = {
  createSetting,
  getAllSettings,
  updateSetting,
};
