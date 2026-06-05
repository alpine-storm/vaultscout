import { useQuery } from "@tanstack/react-query";
import type { TrackedWalletDto, WalletTransactionDto } from "@vaultscout/shared";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api/client";
import { formatUsd, shortenAddress } from "@/lib/utils";
import { ArrowLeft, Activity, Percent, TrendingUp } from "lucide-react";

export function WalletDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: wallet } = useQuery({
    queryKey: ["wallet", id],
    queryFn: () => apiFetch<TrackedWalletDto>(`/api/wallets/${id}`),
    enabled: !!id,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["wallet-txs", id],
    queryFn: () =>
      apiFetch<WalletTransactionDto[]>(`/api/wallets/${id}/transactions`),
    enabled: !!id,
  });

  if (!wallet) {
    return (
      <AppShell>
        <div className="h-8 w-48 animate-pulse rounded-lg bg-secondary/50" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-border/40 bg-secondary/30"
            />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link
        to="/wallets"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to wallets
      </Link>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {wallet.label ?? shortenAddress(wallet.address)}
          </h1>
          <Badge variant="outline">Chain {wallet.chainId}</Badge>
        </div>
        <p className="mono text-muted-foreground">{wallet.address}</p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="PnL"
          value={formatUsd(wallet.pnlUsd)}
          icon={TrendingUp}
          highlight
        />
        <StatCard
          label="Win Rate"
          value={`${(wallet.winRate * 100).toFixed(1)}%`}
          icon={Percent}
        />
        <StatCard label="Trades" value={wallet.tradeCount} icon={Activity} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Indexed Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No transactions yet"
              description="The indexer will populate on-chain activity for this wallet automatically."
            />
          ) : (
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li key={tx.id} className="list-row text-sm">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{tx.action}</Badge>
                    <span className="mono">{shortenAddress(tx.hash, 8)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
