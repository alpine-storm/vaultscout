export type StrategyStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";

export interface StrategyDto {
  id: string;
  name: string;
  description: string | null;
  sourceWalletId: string;
  status: StrategyStatus;
  minCapitalUsd: number;
  subscribed: boolean;
  createdAt: string;
}
