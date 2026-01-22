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
    const resposne = await axios.post(
      `${coreServiceUrl}/api/v3/auth/register`,
      {
        email,
        password,
      },
    );
    console.log(resposne.data);
    const account = resposne.data;
    console.log(account);
    const accessToken = signAccessJwt({
      userId: account.userId,
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
    });
    res.json({ accessToken, refreshToken, account: resposne.data });
  } catch (error) {
    console.error("Registration error:", error);
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

    const accessToken = signAccessJwt({
      userId: account.userId,
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
      email: account.email,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    res.json({
      accessToken,
      refreshToken,
      account: response.data,
    });
  } catch (error) {
    console.error("Login error:", error);
  }
});

router.post("/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      console.error("There is no refresh token");
    }
    const tokenRecord = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenRecord) {
      return console.error("there is a refresh token like that");
    }

    if (new Date() > tokenRecord.expiresAt) {
      return res.status(401).json({ error: "Refresh token expired" });
    }

    const accessToken = signAccessJwt(refreshToken.userId);
    return res.json({ refreshToken, accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
