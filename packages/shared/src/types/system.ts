export interface SystemStatusResponse {
  status: "ok" | "degraded";
  version: string;
  timestamp: string;
  services: {
    database: "up" | "down";
    indexer: "up" | "down" | "idle";
  };
}
