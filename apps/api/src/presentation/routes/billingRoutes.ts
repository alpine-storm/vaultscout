import { Router } from "express";
import { BillingService } from "../../application/services/BillingService";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();
const billingService = new BillingService();

router.get("/status", requireAuth, async (req, res, next) => {
  try {
    const status = await billingService.getStatus(req.user!.id);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post("/checkout", requireAuth, async (req, res, next) => {
  try {
    const session = await billingService.createCheckoutSession(
      req.user!.id,
      req.user!.walletAddress
    );
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.post("/portal", requireAuth, async (req, res, next) => {
  try {
    const portal = await billingService.createPortalSession(req.user!.id);
    res.json(portal);
  } catch (err) {
    next(err);
  }
});

export { router as billingRoutes, billingService };
