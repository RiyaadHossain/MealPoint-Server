import validateRequest from "@/app/middlewares/req-validator.js";
import { Router } from "express";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validators.js";
import { CategoryController } from "./category.controllers.js";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";

const router = Router();

router.get("/", CategoryController.getCategories);

router.post(
  "/",
  validateRequest(createCategorySchema),
  auth(UserRole.ADMIN),
  CategoryController.createCategory
);

router.patch(
  "/:id",
  validateRequest(updateCategorySchema),
  auth(UserRole.ADMIN),
  CategoryController.updateCategory
);

router.delete("/:id", auth(UserRole.ADMIN), CategoryController.deleteCategory);

// Get category details by slug
router.get("/:slug", CategoryController.getCategoryDetailsBySlug);

export const categoryRoutes = router;
