import type { TrackedWalletDto } from "@vaultscout/shared";
import { prisma } from "../database/prisma";
import type {
  CreateTrackedWalletInput,
  IWalletRepository,
} from "../../domain/repositories/IWalletRepository";

function toDto(wallet: {
  id: string;
  address: string;
  label: string | null;
  chainId: number;
  pnlUsd: { toNumber(): number };
  winRate: number;
  tradeCount: number;
  isPublic: boolean;
  createdAt: Date;
}): TrackedWalletDto {
  return {
    id: wallet.id,
    address: wallet.address,
    label: wallet.label,
    chainId: wallet.chainId,
    pnlUsd: Number(wallet.pnlUsd),
    winRate: wallet.winRate,
    tradeCount: wallet.tradeCount,
    isPublic: wallet.isPublic,
    createdAt: wallet.createdAt.toISOString(),
  };
}

export class PrismaWalletRepository implements IWalletRepository {
  async findAllPublic(limit = 50): Promise<TrackedWalletDto[]> {
    const rows = await prisma.trackedWallet.findMany({
      where: { isPublic: true },
      orderBy: { pnlUsd: "desc" },
      take: limit,
    });
    return rows.map(toDto);
  }

  async findById(id: string): Promise<TrackedWalletDto | null> {
    const row = await prisma.trackedWallet.findUnique({ where: { id } });
    return row ? toDto(row) : null;
  }

  async create(input: CreateTrackedWalletInput): Promise<TrackedWalletDto> {
    const row = await prisma.trackedWallet.create({
      data: {
        address: input.address.toLowerCase(),
        label: input.label,
        chainId: input.chainId,
        addedById: input.addedById,
      },
    });
    return toDto(row);
  }
}
