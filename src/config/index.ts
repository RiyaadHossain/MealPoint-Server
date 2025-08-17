import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase",
  JWT_SECRET: process.env.JWT_SECRET || "defaultsecret",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || "10", 10),
};
