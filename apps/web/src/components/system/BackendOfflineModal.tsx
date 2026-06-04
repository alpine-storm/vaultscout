"use client";

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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="backend-offline-title"
    >
      <div className="mx-4 w-full max-w-lg rounded-lg border border-border bg-card p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-destructive/20 p-3">
            <ServerCrash className="h-8 w-8 text-destructive" />
          </div>
          <h1 id="backend-offline-title" className="text-2xl font-bold">
            {title}
          </h1>
        </div>

        <p className="mb-4 text-muted-foreground">
          {isChecking
            ? "Checking API availability at GET /api/system/status..."
            : "VaultScout cannot connect to the API server. The application is blocked until the backend is available."}
        </p>

        {error && (
          <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mb-6 rounded-md bg-secondary p-4 text-sm">
          <p className="mb-2 font-semibold">Start the backend:</p>
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>
              Start PostgreSQL:{" "}
              <code className="text-foreground">docker compose up -d</code>
            </li>
            <li>
              From project root:{" "}
              <code className="text-foreground">npm install</code>
            </li>
            <li>
              Migrate database:{" "}
              <code className="text-foreground">npm run db:push</code>
            </li>
            <li>
              Seed (optional):{" "}
              <code className="text-foreground">npm run db:seed</code>
            </li>
            <li>
              Run API:{" "}
              <code className="text-foreground">npm run dev:api</code>
            </li>
          </ol>
        </div>

        <Button
          className="w-full"
          onClick={() => void retry()}
          disabled={isChecking}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isChecking ? "animate-spin" : ""}`}
          />
          {isChecking ? "Checking..." : "Retry Connection"}
        </Button>
      </div>
    </div>
  );
}
