export type NotificationType =
  | "STRATEGY_SIGNAL"
  | "WALLET_ACTIVITY"
  | "EXECUTION_RESULT"
  | "SYSTEM";

export interface NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
