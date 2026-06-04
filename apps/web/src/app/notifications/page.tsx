"use client";

import { useQuery } from "@tanstack/react-query";
import type { NotificationDto } from "@vaultscout/shared";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiFetch<NotificationDto[]>("/api/notifications"),
    enabled: isAuthenticated,
  });

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Notifications</h1>
      {!isAuthenticated ? (
        <p className="text-muted-foreground">Sign in to view notifications.</p>
      ) : notifications.length === 0 ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className={n.read ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{n.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()} · {n.type}
                </p>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
