import type { SystemStatusResponse } from "@vaultscout/shared";
import { apiFetch } from "./client";

export async function fetchSystemStatus(): Promise<SystemStatusResponse> {
  return apiFetch<SystemStatusResponse>("/api/system/status", {
    cache: "no-store",
  });
}
