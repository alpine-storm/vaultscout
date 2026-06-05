import type { ReactNode } from "react";
import { useBackendStatus } from "@/contexts/BackendStatusContext";
import { BackendOfflineModal } from "./BackendOfflineModal";

export function AppGate({ children }: { children: ReactNode }) {
  const { isOnline } = useBackendStatus();

  return (
    <>
      <BackendOfflineModal />
      {isOnline ? children : null}
    </>
  );
}
