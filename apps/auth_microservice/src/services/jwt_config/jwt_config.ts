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
    return jwt.sign(
      {
        userId: payload.userId,
        accountId: payload.accountId,
        profileId: payload.profileId,
      },
      this.configService.getJwtSecret(),
      { expiresIn: Number(this.configService.getJwtExpiresIn()) },
    );
  }
  verifyAcessToken(token: string) {
    const validation = jwt.verify(
      token,
      this.configService.getJwtSecret() as string,
    );
    if (!validation) {
      throw new Error("Something went wrong with access token");
    }
  }
  signRefreshToken(payload: { userId: string }) {
    return jwt.sign(
      { ...payload, type: "refresh" },
      this.configService.getJwtRefreshSecret() as string,
      { expiresIn: Number(this.configService.getJwtRefreshExpiresIn()) },
    );
  }
  verifyRefreshToken(token: string) {
    const validation = jwt.verify(
      token,
      this.configService.getJwtRefreshSecret() as string,
    );
    if (!validation) {
      throw new Error("Something went wrong with refresh token");
    }
  }
}
