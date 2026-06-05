import { type ReactNode } from "react";
import { BackendStatusProvider } from "@/contexts/BackendStatusContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppGate } from "@/components/system/AppGate";
import { AppKitProvider } from "./AppKitProvider";
import { AppKitInit } from "./AppKitInit";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BackendStatusProvider>
      <AppKitProvider>
        <AppKitInit />
        <AuthProvider>
          <AppGate>{children}</AppGate>
        </AuthProvider>
      </AppKitProvider>
    </BackendStatusProvider>
  );
}
