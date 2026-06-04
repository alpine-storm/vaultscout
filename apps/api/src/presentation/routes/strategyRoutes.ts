import { Router } from "express";
import { StrategyService } from "../../application/services/StrategyService";
import { requireAuth } from "../middleware/authMiddleware";
import { optionalAuth } from "../middleware/optionalAuth";

const router = Router();
const strategyService = new StrategyService();

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const strategies = await strategyService.listStrategies(req.user?.id);
    res.json(strategies);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/subscribe", requireAuth, async (req, res, next) => {
  try {
    await strategyService.subscribe(req.user!.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/subscribe", requireAuth, async (req, res, next) => {
  try {
    await strategyService.unsubscribe(req.user!.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export { router as strategyRoutes };
