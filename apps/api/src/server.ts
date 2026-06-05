import { createApp } from "./presentation/app";
import { env } from "./config/env";
import { IndexerService } from "./application/services/IndexerService";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`VaultScout API listening on http://localhost:${env.PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${env.PORT} is already in use. Run "npm run predev" from the project root, then try again.`
    );
    process.exit(1);
  }
  throw err;
});

if (env.INDEXER_ENABLED && env.NODE_ENV !== "test") {
  const indexer = new IndexerService();
  setInterval(async () => {
    try {
      const count = await indexer.runOnce();
      if (count > 0) {
        console.log(`Indexed ${count} transactions`);
      }
    } catch (err) {
      console.error("Indexer error:", err);
    }
  }, 30_000);
}
