import { useQuery } from "@tanstack/react-query";
import type { NotificationDto } from "@vaultscout/shared";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Lock } from "lucide-react";

export function NotificationsPage() {
  const { isAuthenticated } = useAuth();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiFetch<NotificationDto[]>("/api/notifications"),
    enabled: isAuthenticated,
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Alerts"
        title="Notifications"
        description="Strategy signals, wallet activity, and execution updates."
      />

      {!isAuthenticated ? (
        <EmptyState
          icon={Lock}
          title="Sign in required"
          description="Connect your wallet and sign in to view your notification feed."
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All quiet"
          description="You'll receive notifications when strategies fire signals or wallets move."
        />
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={n.read ? "opacity-55" : "border-primary/15"}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">{n.title}</CardTitle>
                {!n.read && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary shadow-glow-sm" />
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {n.body}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline">{n.type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
