import express from "express";
import { userRoutes } from "../modules/users/user.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", routes: authRoutes },
  {
    path: "/users",
    routes: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));
export default router;
