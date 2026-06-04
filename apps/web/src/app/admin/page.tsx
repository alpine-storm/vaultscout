"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";

interface AdminStats {
  users: number;
  wallets: number;
  strategies: number;
  executions: number;
}

export default function AdminPage() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<AdminStats>("/api/admin/stats"),
    enabled: user?.role === "ADMIN",
  });

  if (user?.role !== "ADMIN") {
    return (
      <AppShell>
        <p className="text-muted-foreground">Admin access required.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {stats &&
          Object.entries(stats).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="capitalize text-sm">{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </AppShell>
  );
}
