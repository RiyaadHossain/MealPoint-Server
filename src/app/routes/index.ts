import express from "express";
import { userRoutes } from "../modules/users/user.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { menuRoutes } from "../modules/menus/menu.routes.js";
import { categoryRoutes } from "../modules/categories/category.routes.js";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", routes: authRoutes },
  {
    path: "/users",
    routes: userRoutes,
  },
  {
    path: "/menus",
    routes: menuRoutes,
  },
  {
    path: "/categories",
    routes: categoryRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));
export default router;
