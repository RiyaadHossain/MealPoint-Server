import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.url().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
});
