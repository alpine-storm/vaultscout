import { prisma } from "../../infrastructure/database/prisma";

export class ExecutionService {
  async createExecution(input: {
    userId: string;
    strategyId?: string;
    chainId: number;
    payload: Record<string, unknown>;
  }) {
    const execution = await prisma.execution.create({
      data: {
        userId: input.userId,
        strategyId: input.strategyId,
        chainId: input.chainId,
        status: "PENDING",
        payload: input.payload,
      },
    });

    await prisma.notification.create({
      data: {
        userId: input.userId,
        type: "EXECUTION_RESULT",
        title: "Execution queued",
        body: `Your one-click execution ${execution.id} is pending.`,
        metadata: { executionId: execution.id },
      },
    });

    return execution;
  }

  async listForUser(userId: string) {
    return prisma.execution.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}
