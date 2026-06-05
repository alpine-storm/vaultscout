import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/20 px-8 py-16 text-center">
      <div className="icon-well mb-4 h-14 w-14 text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-medium">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
