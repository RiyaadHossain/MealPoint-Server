import express from "express";
import { userRoutes } from "../modules/users/user.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { menuRoutes } from "../modules/menus/menu.routes.js";
import { categoryRoutes } from "../modules/categories/category.routes.js";
import { comboRoutes } from "../modules/combos/combo.routes.js";
import { orderRoutes } from "../modules/orders/order.routes.js";
import { ReviewRoutes } from "../modules/reviews/review.routes.js";
import { NotificationRoutes } from "../modules/notifications/notification.route.js";
import { PaymentRoutes } from "../modules/payments/payment.routes.js";
import { AdminSettingsRoutes } from "../modules/settings/setting.routes.js";

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
    routes: categoryRoutes,
  },
  {
    path: "/combos",
    routes: comboRoutes,
  },
  {
    path: "/orders",
    routes: orderRoutes,
  },
  {
    path: "/reviews",
    routes: ReviewRoutes
  }, 
  {
    path: "/notifications",
    routes: NotificationRoutes
  }, 
  {
    path: "/payments",
    routes: PaymentRoutes
  }, 
  {
    path: "/settings",
    routes: AdminSettingsRoutes
  }, 
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));
export default router;
