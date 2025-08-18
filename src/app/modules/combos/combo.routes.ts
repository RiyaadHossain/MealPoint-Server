import express from "express";
import { createComboSchema, updateComboSchema } from "./combo.validators.js";
import auth from "../../middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
import validateRequest from "@/app/middlewares/req-validator.js";
import { ComboController } from "./combo.controllers.js";

const router = express.Router();

router.get("/", ComboController.getCombos);
router.post(
  "/",
  validateRequest(createComboSchema),
  auth(UserRole.ADMIN),
  ComboController.createCombo
);
router.patch(
  "/:id",
  validateRequest(updateComboSchema),
  auth(UserRole.ADMIN),
  ComboController.updateCombo
);
router.delete("/:id", auth(UserRole.ADMIN), ComboController.deleteCombo);

export const comboRoutes = router;
