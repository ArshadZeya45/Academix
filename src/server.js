import app from "../src/app.js";
import { env } from "./config/env.js";
import connectToDb from "./config/db.js";

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(env.port, () => {
      console.log(`server is running or port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
