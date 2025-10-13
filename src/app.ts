import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "app/middlewares/error-middleware.js";
import router from "app/routes/index.js";
import { notFoundHandler } from "app/middlewares/not-found.js";
import { corsOptions } from "./config/cors.js";
import { globalRateLimiter, speedLimiter } from "./config/rate-limit.js";
import { mongoSanitize } from "./app/middlewares/mongo-sanitize.js";

const app = express();

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Security headers
app.use(globalRateLimiter); // Rate limiting
app.use(speedLimiter); // Optional slowdown
app.use(mongoSanitize); // Prevent NoSQL injection

// Routes
app.use("/api/v1/", router);

// Simple health check route
app.get("/", (_req, res) => {
  res.send("✅ API is running!");
});

//handle not found
app.use(notFoundHandler);

// Global Error Handling middleware (must be last)
app.use(errorHandler);

export default app;
