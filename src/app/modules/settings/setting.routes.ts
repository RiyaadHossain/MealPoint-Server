// settings.routes.ts
import express from "express";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
import { AdminSettingValidation } from "./setting.validation.js";
import validateRequest from "@/app/middlewares/req-validator.js";
import { AdminSettingsController } from "./setting.controllers.js";
const router = express.Router();

router.get("/", auth(UserRole.ADMIN), AdminSettingsController.getAllSettings);

router.patch(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(AdminSettingValidation.updateSettingZodSchema),
  AdminSettingsController.updateSetting
);

export const AdminSettingsRoutes = router;
