import { AuthProvider, UserRole } from "@/enums/user.enum.js";
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    address: z.string().optional(),
    provider: z.enum(Object.values(AuthProvider)),
    profileImage: z.url().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
});

export const socialLoginSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.email(),
    role: z.enum(UserRole),
    provider: z.enum(Object.values(AuthProvider)),
    profileImage: z.url().optional(),
  }),
});

export const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.url().optional(),
  }),
});
