import { signJwt, verifyJwt } from "./jwt_config";
import { Router } from "express";
const router = Router();
router.post("/auth/register", (req, res) => {
  const { email, password } = req.body;
});

export default router;
