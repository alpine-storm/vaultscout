import type { SystemStatusResponse } from "@vaultscout/shared";
import { prisma } from "../../infrastructure/database/prisma";
import { env } from "../../config/env";

const API_VERSION = "1.0.0";

export class SystemStatusService {
  async getStatus(): Promise<SystemStatusResponse> {
    let database: "up" | "down" = "down";
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "up";
    } catch {
      database = "down";
    }

    const indexer: SystemStatusResponse["services"]["indexer"] = env.INDEXER_ENABLED
      ? database === "up"
        ? "up"
        : "down"
      : "idle";

    const status: SystemStatusResponse["status"] =
      database === "up" ? "ok" : "degraded";

    return {
      status,
      version: API_VERSION,
      timestamp: new Date().toISOString(),
      services: { database, indexer },
    };
  }
}
