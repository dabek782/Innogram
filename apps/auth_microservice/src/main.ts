import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

import express, { Router } from "express";
import connect_to_Mongo from "./db_config";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import router from "./routes";

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
app.use(
  cors({
    credentials: true,
    origin: process.env.CORE_MICROSERVICE,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(router);

app.use(limiter);
connect_to_Mongo();

app.listen(3002, () => {
  console.log("Auth microservice listening on port 3002");
  console.log("Core service URL:", process.env.CORE_SERVICE);
});
