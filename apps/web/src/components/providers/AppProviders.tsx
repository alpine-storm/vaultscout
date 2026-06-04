"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useState, type ReactNode } from "react";
import { wagmiConfig } from "@/config/wagmi";
import { BackendStatusProvider } from "@/contexts/BackendStatusContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppGate } from "@/components/system/AppGate";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <BackendStatusProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppGate>{children}</AppGate>
          </AuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </BackendStatusProvider>
  );
}
