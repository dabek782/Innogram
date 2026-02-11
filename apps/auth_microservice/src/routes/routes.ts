import { Router } from "express";
import { AuthService } from "../services/auth/auth_service";

const router = Router();
const authService = new AuthService();

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
    return res
      .status(error.response?.status || 500)
      .json({
        error:
          error.response?.data || "Something went wrong with authentication",
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

export default router;
