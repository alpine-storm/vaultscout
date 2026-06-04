import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "../config/env";
import { errorHandler } from "./middleware/errorHandler";
import { systemRoutes } from "./routes/systemRoutes";
import { authRoutes } from "./routes/authRoutes";
import { walletRoutes } from "./routes/walletRoutes";
import { strategyRoutes } from "./routes/strategyRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";
import { executionRoutes } from "./routes/executionRoutes";
import { adminRoutes } from "./routes/adminRoutes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/system", systemRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/wallets", walletRoutes);
  app.use("/api/strategies", strategyRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/executions", executionRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(errorHandler);

  return app;
}
