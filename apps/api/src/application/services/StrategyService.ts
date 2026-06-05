import type { StrategyDto } from "@vaultscout/shared";
import { prisma } from "../../infrastructure/database/prisma";
import { BillingService } from "./BillingService";
import { AppError } from "../../domain/errors/AppError";

function toDto(
  strategy: {
    id: string;
    name: string;
    description: string | null;
    sourceWalletId: string;
    status: string;
    minCapitalUsd: { toNumber(): number };
    createdAt: Date;
  },
  subscribed: boolean
): StrategyDto {
  return {
    id: strategy.id,
    name: strategy.name,
    description: strategy.description,
    sourceWalletId: strategy.sourceWalletId,
    status: strategy.status as StrategyDto["status"],
    minCapitalUsd: Number(strategy.minCapitalUsd),
    subscribed,
    createdAt: strategy.createdAt.toISOString(),
  };
}

export class StrategyService {
  private billing = new BillingService();

  async listStrategies(userId?: string): Promise<StrategyDto[]> {
    const strategies = await prisma.strategy.findMany({
      where: { status: { not: "ARCHIVED" } },
      orderBy: { createdAt: "desc" },
    });

    if (!userId) {
      return strategies.map((s) => toDto(s, false));
    }

    const subs = await prisma.strategySubscription.findMany({
      where: { userId, active: true },
    });
    const subSet = new Set(subs.map((s) => s.strategyId));

    return strategies.map((s) => toDto(s, subSet.has(s.id)));
  }

  async subscribe(userId: string, strategyId: string) {
    await this.billing.requireActiveSubscription(userId);

    const strategy = await prisma.strategy.findUnique({
      where: { id: strategyId },
    });
    if (!strategy || strategy.status === "ARCHIVED") {
      throw new AppError("Strategy not found", 404);
    }

    return prisma.strategySubscription.upsert({
      where: { userId_strategyId: { userId, strategyId } },
      update: { active: true },
      create: { userId, strategyId, active: true },
    });
  }

  async unsubscribe(userId: string, strategyId: string) {
    return prisma.strategySubscription.updateMany({
      where: { userId, strategyId },
      data: { active: false },
    });
  }
}
