import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "./config/index.js";


async function startServer() {
  await connectDB();

  const PORT = dotenv.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server listening on PORT:${dotenv.PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
