"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SystemStatusResponse } from "@vaultscout/shared";
import { fetchSystemStatus } from "@/lib/api/system";

const HEALTH_CHECK_INTERVAL_MS = 10_000;

export interface BackendStatusContextValue {
  isOnline: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  status: SystemStatusResponse | null;
  error: string | null;
  retry: () => Promise<void>;
}

const BackendStatusContext = createContext<BackendStatusContextValue | null>(
  null
);

export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [status, setStatus] = useState<SystemStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const response = await fetchSystemStatus();
      setStatus(response);
      setIsOnline(response.status === "ok" || response.status === "degraded");
      setError(null);
      setLastChecked(new Date());
    } catch (err) {
      setIsOnline(false);
      setStatus(null);
      setError(err instanceof Error ? err.message : "Connection failed");
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    void checkStatus();
    const interval = setInterval(() => {
      void checkStatus();
    }, HEALTH_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const value = useMemo<BackendStatusContextValue>(
    () => ({
      isOnline,
      isChecking,
      lastChecked,
      status,
      error,
      retry: checkStatus,
    }),
    [isOnline, isChecking, lastChecked, status, error, checkStatus]
  );

  return (
    <BackendStatusContext.Provider value={value}>
      {children}
    </BackendStatusContext.Provider>
  );
}

export function useBackendStatus(): BackendStatusContextValue {
  const ctx = useContext(BackendStatusContext);
  if (!ctx) {
    throw new Error("useBackendStatus must be used within BackendStatusProvider");
  }
  return ctx;
}
