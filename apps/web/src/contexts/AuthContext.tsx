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
import { useAccount, useSignMessage } from "wagmi";
import { apiFetch } from "@/lib/api/client";
import { buildSiweMessage } from "@/lib/siwe";

interface AuthUser {
  id: string;
  walletAddress: string;
  role: "USER" | "ADMIN";
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("vaultscout_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await apiFetch<AuthUser>("/api/auth/me");
      setUser(me);
    } catch {
      localStorage.removeItem("vaultscout_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const signIn = useCallback(async () => {
    if (!address || !isConnected) return;

    const { nonce } = await apiFetch<{ nonce: string }>(
      `/api/auth/nonce/${address}`
    );

    const preparedMessage = buildSiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in to VaultScout",
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce,
    });

    const signature = await signMessageAsync({
      message: preparedMessage,
    });

    const { token } = await apiFetch<{ token: string }>("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({
        message: preparedMessage,
        signature,
      }),
    });

    localStorage.setItem("vaultscout_token", token);
    await loadUser();
  }, [address, isConnected, signMessageAsync, loadUser]);

  const signOut = useCallback(() => {
    localStorage.removeItem("vaultscout_token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
    }),
    [user, isLoading, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
