import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  highlight?: boolean;
}

export function StatCard({ label, value, icon: Icon, highlight }: StatCardProps) {
  return (
    <Card className={cn(highlight && "border-primary/20 shadow-glow-sm")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
        <div
          className={cn(
            "icon-well",
            highlight && "border-primary/30 bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "font-display text-3xl font-semibold tracking-tight",
            highlight && "text-primary"
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
