import { useQuery } from "@tanstack/react-query";
import type { TrackedWalletDto } from "@vaultscout/shared";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api/client";
import { formatUsd, shortenAddress } from "@/lib/utils";

export function WalletsPage() {
  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => apiFetch<TrackedWalletDto[]>("/api/wallets"),
  });

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Wallet Tracking</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading wallets...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <Link key={wallet.id} to={`/wallets/${wallet.id}`}>
              <Card className="transition hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {wallet.label ?? shortenAddress(wallet.address)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {shortenAddress(wallet.address)}
                  </p>
                  <p className="mt-2 text-xl font-bold text-primary">
                    {formatUsd(wallet.pnlUsd)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {wallet.tradeCount} trades · {(wallet.winRate * 100).toFixed(1)}% win rate
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
