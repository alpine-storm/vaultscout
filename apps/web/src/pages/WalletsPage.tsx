import { useQuery } from "@tanstack/react-query";
import type { TrackedWalletDto } from "@vaultscout/shared";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api/client";
import { formatUsd, shortenAddress } from "@/lib/utils";
import { ArrowUpRight, Wallet } from "lucide-react";

function walletInitials(label: string) {
  return label
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function WalletsPage() {
  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => apiFetch<TrackedWalletDto[]>("/api/wallets"),
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Intelligence"
        title="Wallet Tracking"
        description="Discover and monitor high-performing on-chain wallets across supported networks."
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-border/40 bg-secondary/30"
            />
          ))}
        </div>
      ) : wallets.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No wallets tracked"
          description="Tracked wallets will appear here once indexed by the system."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => {
            const name = wallet.label ?? shortenAddress(wallet.address);
            return (
              <Link key={wallet.id} to={`/wallets/${wallet.id}`} className="group">
                <Card className="relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-glow-sm">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 font-display text-sm font-semibold text-primary">
                        {walletInitials(name)}
                      </div>
                      <CardTitle className="text-base">{name}</CardTitle>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="mono mb-4 text-muted-foreground">
                      {shortenAddress(wallet.address)}
                    </p>
                    <p className="font-display text-2xl font-semibold text-primary">
                      {formatUsd(wallet.pnlUsd)}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {wallet.tradeCount} trades · {(wallet.winRate * 100).toFixed(1)}% win rate
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
