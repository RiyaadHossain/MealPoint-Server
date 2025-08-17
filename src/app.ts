import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "app/middlewares/error-middleware.js";
import router from "app/routes/index.js";
import { notFoundHandler } from "app/middlewares/not-found.js";

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(helmet()); // Security headers

// Routes
app.use('/api/v1/', router);

// Simple health check route
app.get("/health", (_req, res) => res.send("OK"));

//handle not found
app.use(notFoundHandler);

// Global Error Handling middleware (must be last)
app.use(errorHandler);

export default app;
