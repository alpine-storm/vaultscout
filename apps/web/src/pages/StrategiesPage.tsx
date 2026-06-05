import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StrategyDto } from "@vaultscout/shared";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api/client";
import { formatUsd } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { OneClickExecute } from "@/components/execution/OneClickExecute";
import { Zap } from "lucide-react";

export function StrategiesPage() {
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
      <PageHeader
        eyebrow="Automation"
        title="Strategy Engine"
        description="Subscribe to proven wallet strategies and execute signals with one click."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {strategies.map((strategy) => (
          <Card
            key={strategy.id}
            className={
              strategy.subscribed ? "border-primary/25 shadow-glow-sm" : undefined
            }
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="icon-well h-9 w-9 text-primary">
                    <Zap className="h-4 w-4" />
                  </div>
                  <CardTitle>{strategy.name}</CardTitle>
                </div>
                <Badge
                  variant={strategy.status === "ACTIVE" ? "success" : "outline"}
                >
                  {strategy.status}
                </Badge>
              </div>
              {strategy.subscribed && (
                <Badge variant="default">Subscribed</Badge>
              )}
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {strategy.description ?? "No description provided."}
              </p>
              <p className="mb-5 text-sm">
                <span className="text-muted-foreground">Min capital</span>{" "}
                <span className="font-medium text-foreground">
                  {formatUsd(strategy.minCapitalUsd)}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant={strategy.subscribed ? "outline" : "default"}
                      size="sm"
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
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sign in to subscribe to strategies.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
