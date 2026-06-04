import { createApp } from "./presentation/app";
import { env } from "./config/env";
import { IndexerService } from "./application/services/IndexerService";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`VaultScout API listening on http://localhost:${env.PORT}`);
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
