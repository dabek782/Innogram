import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

import express, { Router } from "express";
import connect_to_Mongo from "./services/database_config/db_config";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import router from "./routes/routes";
import { set } from "mongoose";

const app = express();
app.get("/", (req, res) => {
  res.send(`works `);
});

app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "To much requests try again later",
});
app.use(limiter);
app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/auth", router);

connect_to_Mongo();

const server = app.listen(process.env.PORT, () => {
  console.log(`Auth microservice listening on port ${process.env.PORT}`);
});
const gracefulShutdown = async (signal: string) => {
  server.close(async () => {
    console.log(`Received ${signal}. Shutting down gracefully.`);

    try {
      const mongoose = await import("mongoose");
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
    } catch (error) {
      console.error("Error during MongoDB shutdown:", error);
      process.exit(1);
    }
  });
  setTimeout(() => {
    console.error("Forced shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});
