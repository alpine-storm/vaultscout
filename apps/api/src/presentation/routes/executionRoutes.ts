import { Router } from "express";
import { z } from "zod";
import { ExecutionService } from "../../application/services/ExecutionService";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();
const executionService = new ExecutionService();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const executions = await executionService.listForUser(req.user!.id);
    res.json(executions);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        strategyId: z.string().optional(),
        chainId: z.number().int(),
        payload: z.record(z.unknown()),
      })
      .parse(req.body);

    const execution = await executionService.createExecution({
      userId: req.user!.id,
      ...body,
    });
    res.status(201).json(execution);
  } catch (err) {
    next(err);
  }
});

export { router as executionRoutes };
