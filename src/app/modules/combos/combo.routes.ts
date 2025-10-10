import express from "express";
import { createComboSchema, updateComboSchema } from "./combo.validators.js";
import auth from "../../middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
import validateRequest from "@/app/middlewares/req-validator.js";
import { ComboController } from "./combo.controllers.js";

const router = express.Router();

router.get("/", ComboController.getCombos);
router.get("/id/:id", ComboController.getComboById);
router.get("/:slug", ComboController.getComboDetailsBySlug); // New route for getting combo details by slug
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
