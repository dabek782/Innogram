import dotenv from "dotenv";
import fs from "fs";
export class ConfigService {
  private readonly requiredKeys = [
    "DATABASE_URL",
    "JWT_TOKEN",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "CORE_SERVICE",
    "PORT",
    "MONGO_PORTS",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GITHUB_CALLBACK_URL",
    "FRONTEND_URL",
  ];
  constructor() {
    this.validate();
  }
  private validate() {
    const missing = this.requiredKeys.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required env values : ${missing.join(", ")}`);
    }
  }
  get(key: string): string {
    return process.env[key]!;
  }
}
