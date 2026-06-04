import { Router } from "express";
import { SystemStatusService } from "../../application/services/SystemStatusService";

const router = Router();
const systemStatusService = new SystemStatusService();

router.get("/status", async (_req, res, next) => {
  try {
    const status = await systemStatusService.getStatus();
    res.json(status);
  } catch (err) {
    next(err);
  }
});

export { router as systemRoutes };
