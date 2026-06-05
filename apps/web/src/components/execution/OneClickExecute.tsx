import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Zap } from "lucide-react";

interface OneClickExecuteProps {
  strategyId: string;
  chainId?: number;
}

export function OneClickExecute({
  strategyId,
  chainId = 1,
}: OneClickExecuteProps) {
  const { isAuthenticated } = useAuth();

  const execute = useMutation({
    mutationFn: () =>
      apiFetch("/api/executions", {
        method: "POST",
        body: JSON.stringify({
          strategyId,
          chainId,
          payload: { type: "mirror", slippageBps: 50 },
        }),
      }),
  });

  if (!isAuthenticated) return null;

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => execute.mutate()}
      disabled={execute.isPending}
    >
      <Zap className="h-3.5 w-3.5" />
      {execute.isPending ? "Queuing..." : "Execute"}
    </Button>
  );
}
