import { Router } from "express";
import { z } from "zod";
import { AuthService } from "../../application/services/AuthService";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();
const authService = new AuthService();

router.get("/nonce/:address", async (req, res, next) => {
  try {
    const nonce = await authService.getNonce(req.params.address);
    res.json({ nonce });
  } catch (err) {
    next(err);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const body = z
      .object({ message: z.string(), signature: z.string() })
      .parse(req.body);
    const result = await authService.verifySiwe(body.message, body.signature);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({
    id: req.user!.id,
    walletAddress: req.user!.walletAddress,
    role: req.user!.role,
  });
});

export { router as authRoutes };
