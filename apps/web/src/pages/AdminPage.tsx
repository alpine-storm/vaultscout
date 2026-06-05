import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Users, Wallet, Zap, Play } from "lucide-react";

interface AdminStats {
  users: number;
  wallets: number;
  strategies: number;
  executions: number;
}

const statConfig: Record<
  keyof AdminStats,
  { label: string; icon: typeof Users }
> = {
  users: { label: "Users", icon: Users },
  wallets: { label: "Wallets", icon: Wallet },
  strategies: { label: "Strategies", icon: Zap },
  executions: { label: "Executions", icon: Play },
};

export function AdminPage() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<AdminStats>("/api/admin/stats"),
    enabled: user?.role === "ADMIN",
  });

  if (user?.role !== "ADMIN") {
    return (
      <AppShell>
        <EmptyState
          icon={Shield}
          title="Admin access required"
          description="This area is restricted to administrator accounts."
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Control"
        title="Admin Panel"
        description="Platform metrics and system overview."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats &&
          (Object.entries(stats) as [keyof AdminStats, number][]).map(
            ([key, value]) => {
              const config = statConfig[key];
              return (
                <StatCard
                  key={key}
                  label={config.label}
                  value={value}
                  icon={config.icon}
                />
              );
            }
          )}
      </div>
    </AppShell>
  );
}
