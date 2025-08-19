import { z } from "zod";
import { UserRole } from "@/enums/user.enum.js";

/**
 * Zod schema for creating a user
 */
export const createUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum([UserRole.ADMIN, UserRole.CUSTOMER]),
  }),
});

/**
 * Zod schema for updating a user
 */
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.CUSTOMER]).optional(),
  }),
});
