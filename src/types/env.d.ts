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
    // add other env variables you expect here
  }
}
