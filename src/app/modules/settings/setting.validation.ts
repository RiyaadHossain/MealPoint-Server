// settings.validation.ts
import { z } from "zod";

export const updateSettingZodSchema = z.object({
  body: z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required"),
  }),
});

export const AdminSettingValidation = { updateSettingZodSchema };
