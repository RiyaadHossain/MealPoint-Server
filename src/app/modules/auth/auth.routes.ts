import validateRequest from "@/app/middlewares/req-validator.js";
import { Router } from "express";
import {
  loginSchema,
  registerSchema,
  updateSchema,
} from "./auth.validators.js";
import { AuthController } from "./auth.controllers.js";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
const router = Router();

// POST /auth/register
router.post(
  "/register",
  validateRequest(registerSchema),
  AuthController.register
);

// POST /auth/login
router.post("/login", validateRequest(loginSchema), AuthController.login);

router.get(
  "/profile",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  AuthController.getProfile
);

router.patch(
  "/profile",
  validateRequest(updateSchema),
  auth(UserRole.CUSTOMER),
  AuthController.updateProfile
);

export const authRoutes = router;
