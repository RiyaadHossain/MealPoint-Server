import validateRequest from '@/app/middlewares/req-validator.js';
import { Router } from 'express';
import { loginSchema, registerSchema } from './auth.validators.js';
import { AuthController } from './auth.controllers.js';
const router = Router();

// POST /auth/register
router.post('/register', validateRequest(registerSchema), AuthController.register);

// POST /auth/login
router.post('/login', validateRequest(loginSchema), AuthController.login);

export const authRoutes = router;
