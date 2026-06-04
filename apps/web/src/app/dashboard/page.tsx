"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrackedWalletDto, StrategyDto } from "@vaultscout/shared";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api/client";
import { formatUsd, shortenAddress } from "@/lib/utils";
import { TrendingUp, Wallet, Zap } from "lucide-react";

export default function DashboardPage() {
  const { data: wallets = [] } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => apiFetch<TrackedWalletDto[]>("/api/wallets"),
  });

  const { data: strategies = [] } = useQuery({
    queryKey: ["strategies"],
    queryFn: () => apiFetch<StrategyDto[]>("/api/strategies"),
  });

  const topWallet = wallets[0];
  const activeStrategies = strategies.filter((s) => s.status === "ACTIVE");

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor alpha wallets and subscribed strategies
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tracked Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStrategies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top PnL</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {topWallet ? formatUsd(topWallet.pnlUsd) : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Wallets</CardTitle>
            <CardDescription>Highest reported PnL</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {wallets.slice(0, 5).map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{w.label ?? shortenAddress(w.address)}</p>
                    <p className="text-xs text-muted-foreground">
                      {shortenAddress(w.address)} · {(w.winRate * 100).toFixed(0)}% win
                    </p>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatUsd(w.pnlUsd)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategies</CardTitle>
            <CardDescription>Available to subscribe</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {strategies.slice(0, 5).map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Min {formatUsd(s.minCapitalUsd)}
                    </p>
                  </div>
                  <span className="text-xs uppercase text-muted-foreground">
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
