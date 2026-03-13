import axios from "axios";
import { JwtService } from "../jwt_config/jwt_config";
import { RefreshToken } from "../database_config/db_config";
import { ConfigService } from "../config/config_service";

export class AuthService {
  private readonly configService: ConfigService;
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
    this.configService = new ConfigService();
  }

  async authenticate(email: string, password: string) {
    const url = this.configService.get("CORE_SERVICE");

    console.log(
      "Forwarding to core service:",
      `${url}/api/v3/auth/authenticate`,
    );

    const response = await axios.post(`${url}/api/v3/auth/authenticate`, {
      email,
      password,
    });

    const account = response.data;

    const action = account.action;

    console.log(
      `User ${action === "login" ? "logged in" : "registered"}:`,
      account,
    );

    const provisionalAccessToken = this.jwtService.signAccessToken({
      userId: account.userId,
      accountId: account.accountId,
      profileId: null,
    });

    const refreshToken = this.jwtService.signRefreshToken({
      userId: account.userId,
    });
    const refreshExpires = this.configService.get("JWT_REFRESH_EXPIRES");

    const expiresAt = new Date();

    expiresAt.setSeconds(expiresAt.getSeconds() + Number(refreshExpires));
    console.log(account.userId);
    let resolvedProfileId: string | null = null;
    const userId = account.userId;
    console.log(userId);
    try {
      const profileres = await axios.get(
        `${url}/api/v3/profile/profile-Id/${account.userId}`,
        {
          headers: { Authorization: `Bearer ${provisionalAccessToken}` },
        },
      );
      resolvedProfileId = profileres.data || null;
    } catch (error) {
      console.error("Profile fetch failed", error);
      resolvedProfileId = null;
    }
    console.log(resolvedProfileId);
    const accessToken = this.jwtService.signAccessToken({
      userId: account.userId,
      accountId: account.accountId,
      profileId: resolvedProfileId,
    });

    await RefreshToken.create({
      userId: account.userId,
      token: refreshToken,
      expiresAt,
      accountId: account.accountId,
      profileId: resolvedProfileId,
    });

    return { accessToken, refreshToken, account: response.data };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token required");
    }

    const tokenRecord = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenRecord) {
      throw new Error("Invalid refresh token");
    }

    if (new Date() > tokenRecord.expiresAt) {
      throw new Error("Refresh token expired");
    }

    const accessToken = this.jwtService.signAccessToken({
      userId: tokenRecord.userId,
      accountId: tokenRecord.accountId,
      profileId: tokenRecord.profileId,
    });

    return { refreshToken, accessToken };
  }
}
