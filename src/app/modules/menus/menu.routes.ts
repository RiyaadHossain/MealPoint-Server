import validateRequest from "@/app/middlewares/req-validator.js";
import { Router } from "express";
import { createMenuSchema, updateMenuSchema } from "./menu.validators.js";
import { MenuController } from "./menu.controllers.js";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
const router = Router();

// GET /menu?startPrice=500&endPrice=1000&category="Burgers"
router.get("/", MenuController.getMenus);

// Get menu details by ID
router.get("/:id", MenuController.getMenuDetails);

// Get menu details by Slug
router.get("/slug/:slug", MenuController.getMenuDetailsBySlug);

// Only admin can access these routes
router.post(
  "/",
  validateRequest(createMenuSchema),
  auth(UserRole.ADMIN),
  MenuController.createMenu
);

router.patch(
  "/:id",
  validateRequest(updateMenuSchema),
  auth(UserRole.ADMIN),
  MenuController.updateMenu
);

router.delete("/:id", auth(UserRole.ADMIN), MenuController.deleteMenu);

export const menuRoutes = router;
