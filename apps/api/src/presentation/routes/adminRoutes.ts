import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../infrastructure/database/prisma";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", async (_req, res, next) => {
  try {
    const [users, wallets, strategies, executions] = await Promise.all([
      prisma.user.count(),
      prisma.trackedWallet.count(),
      prisma.strategy.count(),
      prisma.execution.count(),
    ]);
    res.json({ users, wallets, strategies, executions });
  } catch (err) {
    next(err);
  }
});

router.post("/strategies", async (req, res, next) => {
  try {
    const body = z
      .object({
        name: z.string().min(1),
        description: z.string().optional(),
        sourceWalletId: z.string(),
        minCapitalUsd: z.number().positive(),
        rulesJson: z.record(z.unknown()),
      })
      .parse(req.body);

    const strategy = await prisma.strategy.create({ data: body });
    res.status(201).json(strategy);
  } catch (err) {
    next(err);
  }
});

router.get("/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        walletAddress: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

export { router as adminRoutes };
