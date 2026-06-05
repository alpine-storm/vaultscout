import { useQuery } from "@tanstack/react-query";
import type { TrackedWalletDto, StrategyDto } from "@vaultscout/shared";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api/client";
import { formatUsd, shortenAddress } from "@/lib/utils";
import { TrendingUp, Wallet, Zap } from "lucide-react";

export function DashboardPage() {
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
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Monitor alpha wallets, track performance, and manage strategy subscriptions in one place."
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Tracked Wallets" value={wallets.length} icon={Wallet} />
        <StatCard
          label="Active Strategies"
          value={activeStrategies.length}
          icon={Zap}
        />
        <StatCard
          label="Top PnL"
          value={topWallet ? formatUsd(topWallet.pnlUsd) : "—"}
          icon={TrendingUp}
          highlight
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Wallets</CardTitle>
            <CardDescription>Highest reported profit & loss</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {wallets.slice(0, 5).map((w, i) => (
                <li key={w.id} className="list-row">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/80 text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">
                        {w.label ?? shortenAddress(w.address)}
                      </p>
                      <p className="mono text-muted-foreground">
                        {shortenAddress(w.address)} · {(w.winRate * 100).toFixed(0)}% win
                      </p>
                    </div>
                  </div>
                  <span className="font-display font-semibold text-primary">
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
            <ul className="space-y-2">
              {strategies.slice(0, 5).map((s) => (
                <li key={s.id} className="list-row">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Min {formatUsd(s.minCapitalUsd)}
                    </p>
                  </div>
                  <Badge
                    variant={s.status === "ACTIVE" ? "success" : "outline"}
                  >
                    {s.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
