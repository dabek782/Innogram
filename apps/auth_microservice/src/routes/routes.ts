import { Router } from "express";
import { AuthService } from "../services/auth/auth_service";
import passport, { Passport } from "passport";
import { ConfigService } from "../services/config/config_service";
import { JwtService } from "../services/jwt_config/jwt_config";
import { RefreshToken } from "../services/database_config/db_config";
const router = Router();
const authService = new AuthService();
const configService = new ConfigService();
const jwtService = new JwtService();
router.post("/authenticate", async (req, res) => {
  console.log("Authenticate endpoint hit");
  const { email, password } = req.body;
  console.log("Request body:", { email, password });

  try {
    const result = await authService.authenticate(email, password);
    res.json(result);
  } catch (error: any) {
    console.error("Authentication error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || "Something went wrong with authentication",
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return res.json(result);
  } catch (error: any) {
    console.error("Refresh token error:", error.message);
    const status = error.message.includes("expired") ? 401 : 400;
    return res.status(status).json({ error: error.message });
  }
});

router.get(
  "/oauth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);
router.get(
  "/oauth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${configService.getClientAppUrl()}/auth/signin?error=oauth_failed`,
  }),
  async (req, res) => {
    try {
      const data = req.user as any;
      const accessToken = jwtService.signAccessToken(data);
      const refreshToken = jwtService.signRefreshToken({ userId: data.userId });
      const expiresAt = new Date();
      expiresAt.setSeconds(
        expiresAt.getSeconds() + Number(process.env.JWT_REFRESH_EXPIRES),
      );

      await RefreshToken.create({
        userId: data.userId,
        token: refreshToken,
        expiresAt: expiresAt,
        accountId: data.accountId,
        profileId: data.profileId || null,
      });

      // Redirect to frontend with tokens
      res.redirect(
        `${configService.getClientAppUrl()}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`,
      );
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect(
        `${configService.getClientAppUrl()}/auth/signin?error=auth_failed`,
      );
    }
  },
);
export default router;
