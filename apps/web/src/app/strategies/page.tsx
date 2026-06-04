"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StrategyDto } from "@vaultscout/shared";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api/client";
import { formatUsd } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { OneClickExecute } from "@/components/execution/OneClickExecute";

export default function StrategiesPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: strategies = [] } = useQuery({
    queryKey: ["strategies"],
    queryFn: () => apiFetch<StrategyDto[]>("/api/strategies"),
  });

  const subscribe = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/strategies/${id}/subscribe`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["strategies"] }),
  });

  const unsubscribe = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/strategies/${id}/subscribe`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["strategies"] }),
  });

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Strategy Engine</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {strategies.map((strategy) => (
          <Card key={strategy.id}>
            <CardHeader>
              <CardTitle>{strategy.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {strategy.description ?? "No description"}
              </p>
              <p className="mb-4 text-sm">
                Min capital: {formatUsd(strategy.minCapitalUsd)} · {strategy.status}
              </p>
              <div className="flex flex-wrap gap-2">
                {isAuthenticated && (
                  <>
                    <Button
                      variant={strategy.subscribed ? "outline" : "default"}
                      onClick={() =>
                        strategy.subscribed
                          ? unsubscribe.mutate(strategy.id)
                          : subscribe.mutate(strategy.id)
                      }
                    >
                      {strategy.subscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                    {strategy.subscribed && (
                      <OneClickExecute strategyId={strategy.id} />
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
