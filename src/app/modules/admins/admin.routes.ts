// routes/admin.routes.ts
import { Router } from "express";
import auth from "@/app/middlewares/auth.js";
import { UserRole } from "@/enums/user.enum.js";
import { AdminController } from "./admin.controllers.js";

const router = Router();

router.get("/statistics", auth(UserRole.ADMIN), AdminController.getStatistics);
router.get("/statistics/sales-orders", auth(UserRole.ADMIN), AdminController.getSalesOrdersStatistics);
router.get("/analytics/sales-summary", auth(UserRole.ADMIN), AdminController.getSalesSummary);

export const AdminRoutes = router;
