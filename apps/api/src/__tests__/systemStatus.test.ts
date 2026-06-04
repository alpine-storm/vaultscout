import { describe, it, expect, vi, beforeEach } from "vitest";
import { SystemStatusService } from "../application/services/SystemStatusService";
import { prisma } from "../infrastructure/database/prisma";

vi.mock("../infrastructure/database/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe("SystemStatusService", () => {
  const service = new SystemStatusService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns ok when database is up", async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ "?column?": 1 }]);
    const status = await service.getStatus();
    expect(status.status).toBe("ok");
    expect(status.services.database).toBe("up");
    expect(status.version).toBe("1.0.0");
  });

  it("returns degraded when database is down", async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error("db down"));
    const status = await service.getStatus();
    expect(status.status).toBe("degraded");
    expect(status.services.database).toBe("down");
  });
});
