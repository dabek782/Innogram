import {
  signAccessJwt,
  verifyAccessJwt,
  signRefreshJwt,
  verifyRefreshJwt,
} from "./jwt_config";
import { Router } from "express";
import axios from "axios";
import { RefreshToken } from "./db_config";

const router = Router();
const coreServiceUrl = process.env.CORE_SERVICE;

router.post("/auth/register", async (req, res) => {
  console.log("Register endpoint hit");
  const { email, password } = req.body;
  console.log("Request body:", { email, password });
  try {
    console.log(
      "Forwarding to core service:",
      `${coreServiceUrl}/api/v3/auth/register`,
    );
    const response = await axios.post(
      `${coreServiceUrl}/api/v3/auth/register`,
      {
        email,
        password,
      },
    );

    console.log(response.data);
    const account = response.data;

    const accessToken = signAccessJwt({
      userId: account.userId,
      accountId: account.id,
      profileId: null,
    });
    const refreshToken = signRefreshJwt({
      userId: account.userId,
    });
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + Number(process.env.JWT_REFRESH_EXPIRES),
    );
    await RefreshToken.create({
      userId: account.userId,
      token: refreshToken,
      expiresAt: expiresAt,
      accountId: account.id,
      profileId: null,
    });
    res.json({ accessToken, refreshToken, account: response.data });
  } catch (error) {
    return res.status(500).json({});
  }
});
router.post("/auth/login", async (req, res) => {
  console.log("Login endpoint hit");
  const { email, password } = req.body;
  console.log("Request body:", { email, password });
  try {
    console.log(
      "Forwarding to core service:",
      `${coreServiceUrl}/api/v3/auth/login`,
    );
    const response = await axios.post(`${coreServiceUrl}/api/v3/auth/login`, {
      email,
      password,
    });
    const account = response.data;
    let profileId = null;
    try {
      const profileResponse = await axios.get(
        `${coreServiceUrl}/api/v3/profile/get/${account.userId}`,
      );
      if (profileResponse.data !== null) {
        profileId = profileResponse.data.id;
      }
    } catch (error) {
      console.log("no profile found");
    }
    const refreshToken = signRefreshJwt({
      userId: account.userId,
    });
    const accessToken = signAccessJwt({
      userId: account.userId,
      accountId: account.id,
      profileId: profileId,
    });

    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + Number(process.env.JWT_REFRESH_EXPIRES),
    );

    await RefreshToken.create({
      userId: account.userId,
      token: refreshToken,
      expiresAt: expiresAt,
      accountId: account.id,
      profileId: profileId,
    });

    res.json({
      accessToken,
      refreshToken,
      account: response.data,
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token required" });
    }
    const tokenRecord = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenRecord) {
      return res.status(400).json({ error: "Invalid refresh token" });
    }

    if (new Date() > tokenRecord.expiresAt) {
      return res.status(401).json({ error: "Refresh token expired" });
    }

    const accessToken = signAccessJwt({
      userId: tokenRecord.userId,
      accountId: tokenRecord.accountId,
      profileId: tokenRecord.profileId,
    });
    return res.json({ refreshToken, accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
