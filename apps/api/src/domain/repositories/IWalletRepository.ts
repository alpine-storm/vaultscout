import type { TrackedWalletDto } from "@vaultscout/shared";

export interface CreateTrackedWalletInput {
  address: string;
  label?: string;
  chainId: number;
  addedById?: string;
}

export interface IWalletRepository {
  findAllPublic(limit?: number): Promise<TrackedWalletDto[]>;
  findById(id: string): Promise<TrackedWalletDto | null>;
  create(input: CreateTrackedWalletInput): Promise<TrackedWalletDto>;
}
