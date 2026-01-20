import express, { Router } from "express";
import connect_to_Mongo from "./db_config";
import * as dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

dotenv.config({ path: "./.env" });
const router = express.Router();
const app = express();
app.get("/", (req, res) => {
  res.send(`works `);
});

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: process.env.CORE_MICROSERVICE,
  }),
);
app.use(express.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "To much requests try again later",
});
app.use(limiter);
const uri = process.env.DATABASE_URL;
if (!uri) {
  throw new Error("Uri not set");
} else {
  connect_to_Mongo(uri);
}

app.listen(3002, () => {
  console.log("Working ");
});
