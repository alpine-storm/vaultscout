import { RefreshCw, ServerCrash } from "lucide-react";
import { useBackendStatus } from "@/contexts/BackendStatusContext";
import { Button } from "@/components/ui/button";

export function BackendOfflineModal() {
  const { isOnline, isChecking, error, retry } = useBackendStatus();

  if (isOnline) {
    return null;
  }

  const title = isChecking ? "Connecting to Backend..." : "Backend Offline";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="backend-offline-title"
    >
      <div className="glass-panel mx-4 w-full max-w-lg rounded-2xl p-8 shadow-glow">
        <div className="mb-6 flex items-center gap-4">
          <div className="icon-well h-14 w-14 border-destructive/30 bg-destructive/10 text-destructive">
            <ServerCrash className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              System
            </p>
            <h1
              id="backend-offline-title"
              className="font-display text-2xl font-semibold"
            >
              {title}
            </h1>
          </div>
        </div>

        <p className="mb-4 leading-relaxed text-muted-foreground">
          {isChecking
            ? "Checking API availability at GET /api/system/status..."
            : "VaultScout cannot connect to the API server. The application is blocked until the backend is available."}
        </p>

        {error && (
          <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mb-6 rounded-xl border border-border/50 bg-secondary/30 p-4 text-sm">
          <p className="mb-3 font-medium">Start the backend (Windows, no Docker):</p>
          <ol className="list-decimal space-y-1.5 pl-5 text-muted-foreground">
            <li>
              From project root:{" "}
              <code className="mono rounded-md bg-background/60 px-1.5 py-0.5 text-foreground">
                npm install
              </code>
            </li>
            <li>
              First-time setup:{" "}
              <code className="mono rounded-md bg-background/60 px-1.5 py-0.5 text-foreground">
                npm run setup
              </code>
            </li>
            <li>
              Start API + web:{" "}
              <code className="mono rounded-md bg-background/60 px-1.5 py-0.5 text-foreground">
                npm run dev
              </code>
            </li>
          </ol>
        </div>

        <Button
          className="w-full"
          onClick={() => void retry()}
          disabled={isChecking}
        >
          <RefreshCw
            className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`}
          />
          {isChecking ? "Checking..." : "Retry Connection"}
        </Button>
      </div>
    </div>
  );
}
