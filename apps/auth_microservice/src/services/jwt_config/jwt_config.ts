import jwt from "jsonwebtoken";
import { ConfigService } from "../config/config_service";

export class JwtService {
  private readonly configService;
  constructor() {
    this.configService = new ConfigService();
  }

  signAccessToken(payload: {
    userId: string;
    accountId: string;
    profileId: string | null;
  }) {
    const jwtToken = this.configService.get("JWT_TOKEN");
    const jwtAccessExpires = this.configService.get("JWT_ACCESS_EXPIRES");
    if (!jwtToken) {
      throw new Error("JWT_TOKEN is not defined in environment variables.");
    }
    const jwtToken = this.configService.get("JWT_TOKEN");
    const jwtAccessExpires = this.configService.get("JWT_ACCESS_EXPIRES");
    if (!jwtToken) {
      throw new Error("JWT_TOKEN is not defined in environment variables.");
    }
    return jwt.sign(
      {
        userId: payload.userId,
        accountId: payload.accountId,
        profileId: payload.profileId,
      },
      jwtToken,
      { expiresIn: Number(jwtAccessExpires) },
      jwtToken,
      { expiresIn: Number(jwtAccessExpires) },
    );
  }

  verifyAcessToken(token: string) {
    const jwtToken = this.configService.get("JWT_TOKEN");
    const validation = jwt.verify(token, jwtToken as string);
    const jwtToken = this.configService.get("JWT_TOKEN");
    const validation = jwt.verify(token, jwtToken as string);
    if (!validation) {
      throw new Error("Something went wrong with access token");
    }
    return validation;
    return validation;
  }

  signRefreshToken(payload: { userId: string }) {
    const jwtRefreshSecret = this.configService.get("JWT_REFRESH_SECRET");
    const jwtRefreshExpiresIn = this.configService.get("JWT_REFRESH_EXPIRES");
    return jwt.sign(
      { ...payload, type: "refresh" },
      jwtRefreshSecret as string,
      { expiresIn: Number(jwtRefreshExpiresIn) },
      jwtRefreshSecret as string,
      { expiresIn: Number(jwtRefreshExpiresIn) },
    );
  }

  verifyRefreshToken(token: string) {
    const jwtRefreshSecret = this.configService.get("JWT_REFRESH_SECRET");
    const validation = jwt.verify(token, jwtRefreshSecret as string);
    const jwtRefreshSecret = this.configService.get("JWT_REFRESH_SECRET");
    const validation = jwt.verify(token, jwtRefreshSecret as string);
    if (!validation) {
      throw new Error("Something went wrong with refresh token");
    }
    return validation;
    return validation;
  }
}
export const jwtService = new JwtService();
export const jwtService = new JwtService();
