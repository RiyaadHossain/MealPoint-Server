import config from "./index.js";

export const corsOptions = {
  origin: [config.CLIENT_URL], // Adjust this in production to your client's domain
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
