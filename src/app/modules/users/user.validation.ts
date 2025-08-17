import { UserLevel, UserRole } from '@/enums/user.enum.js';
import { z } from 'zod';

export const UserRoleEnum = z.enum(UserRole);
export const UserLevelEnum = z.enum(UserLevel);

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.email().max(100),
    password: z.string().min(6).max(255),
    phone: z.string().max(20).optional(),
    address: z.string().optional(),
    profileImage: z.url().optional(),
    role: UserRoleEnum.optional(),
    level: UserLevelEnum.optional(),
    targetPoints: z.number().int().min(0).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
    address: z.string().optional(),
    profileImage: z.string().url().optional(),
    role: UserRoleEnum.optional(),
    level: UserLevelEnum.optional(),
    targetPoints: z.number().int().min(0).optional(),
    verified: z.boolean().optional(),
    password: z.string().min(6).max(255).optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
  ),
});
