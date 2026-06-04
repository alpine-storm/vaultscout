"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrackedWalletDto, WalletTransactionDto } from "@vaultscout/shared";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api/client";
import { formatUsd, shortenAddress } from "@/lib/utils";

export default function WalletDetailPage() {
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
        <p className="text-muted-foreground">Loading wallet...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="mb-2 text-3xl font-bold">
        {wallet.label ?? shortenAddress(wallet.address)}
      </h1>
      <p className="mb-6 font-mono text-sm text-muted-foreground">{wallet.address}</p>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">PnL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatUsd(wallet.pnlUsd)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(wallet.winRate * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{wallet.tradeCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Indexed Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions indexed yet.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between rounded border border-border p-3 text-sm"
                >
                  <span>
                    {tx.action} · {shortenAddress(tx.hash, 6)}
                  </span>
                  <span className="text-muted-foreground">
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
