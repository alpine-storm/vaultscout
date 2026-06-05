export type PlatformSubscriptionStatus =
  | "NONE"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "TRIALING";

export interface BillingStatusDto {
  status: PlatformSubscriptionStatus;
  active: boolean;
  currentPeriodEnd: string | null;
  planName: string;
  priceUsd: number;
  interval: "month" | "year";
  mockMode: boolean;
}

export interface CheckoutResponseDto {
  url: string;
  mock?: boolean;
}
