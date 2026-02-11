export class ConfigService {
  getJwtSecret(): string {
    const secret = process.env.JWT_TOKEN;
    if (!secret) throw new Error("JWT_TOKEN is not set");
    return secret;
  }

  getJwtExpiresIn(): string {
    return process.env.JWT_ACCESS_EXPIRES || "1h";
  }

  getJwtRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");
    return secret;
  }

  getJwtRefreshExpiresIn(): string {
    return process.env.JWT_REFRESH_EXPIRES || "7d";
  }
  getPort(): string {
    return process.env.PORT || "3002";
  }

  getDatabaseUrl(): string {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    return url;
  }

  getCoreServiceUrl(): string {
    const url = process.env.CORE_SERVICE;
    if (!url) throw new Error("CORE_SERVICE is not set");
    return url;
  }

  getMongoUri(): string {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");
    return uri;
  }
}
