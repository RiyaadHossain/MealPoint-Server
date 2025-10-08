// src/types/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    LOG_LEVEL?: string;
    PORT?: string;
    MONGO_URI?: string;
    JWT_SECRET?: string;
    JWT_EXPIRATION?: string;
    SALT_ROUNDS?: string;
    STRIPE_API_KEY?: string;
    CLIENT_URL: string;
    SOCIAL_LOGIN_PASSWORD: string;
  }
}
