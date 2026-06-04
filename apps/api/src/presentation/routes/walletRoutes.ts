import { Router } from "express";
import { z } from "zod";
import { PrismaWalletRepository } from "../../infrastructure/repositories/PrismaWalletRepository";
import { WalletService } from "../../application/services/WalletService";
import { requireAuth } from "../middleware/authMiddleware";
import { prisma } from "../../infrastructure/database/prisma";

const router = Router();
const walletService = new WalletService(new PrismaWalletRepository());

router.get("/", async (_req, res, next) => {
  try {
    const wallets = await walletService.listTopWallets();
    res.json(wallets);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const wallet = await walletService.getWallet(req.params.id);
    if (!wallet) {
      res.status(404).json({ error: "Wallet not found" });
      return;
    }
    res.json(wallet);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/transactions", async (req, res, next) => {
  try {
    const txs = await prisma.walletTransaction.findMany({
      where: { walletId: req.params.id },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    res.json(
      txs.map((t) => ({
        id: t.id,
        hash: t.hash,
        chainId: t.chainId,
        fromAddress: t.fromAddress,
        toAddress: t.toAddress,
        value: t.value,
        tokenSymbol: t.tokenSymbol,
        action: t.action,
        timestamp: t.timestamp.toISOString(),
      }))
    );
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const body = z
      .object({
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        label: z.string().optional(),
        chainId: z.number().int().positive(),
      })
      .parse(req.body);

    const wallet = await walletService.trackWallet({
      ...body,
      userId: req.user!.id,
    });
    res.status(201).json(wallet);
  } catch (err) {
    next(err);
  }
});

export { router as walletRoutes };
