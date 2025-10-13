// src/middlewares/rateLimit.ts
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

/**
 * 🔹 Global rate limiter for all API routes
 * Limits each IP to 100 requests per 15 minutes
 */
export const globalRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

/**
 * 🔹 Login-specific rate limiter
 * Only 5 attempts per 15 minutes from one IP
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many failed login attempts. Try again in 15 minutes.",
  },
});

/**
 * 🔹 Optional slowdown middleware
 * Gradually increases delay between repeated requests from same IP
 */
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 min window
  delayAfter: 50, // Allow 50 requests before slowing down
  delayMs: () => 500, // Add 500ms delay per request after hitting limit
});
