import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  // Note: no call to next() here because response is ended
}
