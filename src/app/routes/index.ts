import express from "express";
import userRoutes from "@app/modules/users/user.route.js";

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    routes: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));
export default router;
