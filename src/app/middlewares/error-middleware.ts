import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import dotenv from "@config/index.js";

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const status = err.status || "error";

  // In production, hide details for non-operational errors
  const message =
    dotenv.NODE_ENV === "production" && !err.isOperational
      ? "Something went wrong"
      : err.message;

  console.error(err);

  res.status(statusCode).json({
    status,
    success: false,
    message,
  });
}
