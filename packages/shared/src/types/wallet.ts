export interface TrackedWalletDto {
  id: string;
  address: string;
  label: string | null;
  chainId: number;
  pnlUsd: number;
  winRate: number;
  tradeCount: number;
  isPublic: boolean;
  createdAt: string;
}

export interface WalletTransactionDto {
  id: string;
  hash: string;
  chainId: number;
  fromAddress: string;
  toAddress: string;
  value: string;
  tokenSymbol: string | null;
  action: string;
  timestamp: string;
}
