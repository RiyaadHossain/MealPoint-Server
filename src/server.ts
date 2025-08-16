import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "./config/index.js";

async function startServer() {
  await connectDB();

  app.listen(dotenv.PORT, () => {
    console.log(`✅ Server listening on http://localhost:${dotenv.PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
