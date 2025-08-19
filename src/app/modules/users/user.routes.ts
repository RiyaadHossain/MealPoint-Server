import { Router } from "express";
import { UserController } from "./user.controllers.js";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
const router = Router();

// GET /users
router.get("/", auth(UserRole.ADMIN), UserController.getUsers);

// GET /users/:id (admin only)
router.get("/:id", auth(UserRole.ADMIN), UserController.getUserById);

export const userRoutes = router;
