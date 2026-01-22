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
      email: account.email,
    });
    const refreshToken = signRefreshJwt({
      userId: account.userId,
      email: account.email,
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
      email: account.email,
    });
    const refreshToken = signRefreshJwt({
      userId: account.userId,
      email: account.email,
    });

    // Store refresh token in MongoDB
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + Number(process.env.JWT_REFRESH_EXPIRES),
    );

    await RefreshToken.create({
      userId: account.userId,
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

// router.post("/auth/refresh", async (req, res) => {
//   const { refreshToken } = req.body;
//   const response = await axios.post();
// });
export default router;
