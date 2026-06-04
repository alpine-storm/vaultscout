import { PrismaClient, StrategyStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { walletAddress: "0x0000000000000000000000000000000000000001" },
    update: { role: "ADMIN" },
    create: {
      walletAddress: "0x0000000000000000000000000000000000000001",
      role: "ADMIN",
    },
  });

  const wallet = await prisma.trackedWallet.upsert({
    where: {
      address_chainId: {
        address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        chainId: 1,
      },
    },
    update: {},
    create: {
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      label: "Alpha Trader",
      chainId: 1,
      pnlUsd: 125000,
      winRate: 0.68,
      tradeCount: 342,
      isPublic: true,
      addedById: admin.id,
    },
  });

  await prisma.strategy.upsert({
    where: { id: "seed-strategy-1" },
    update: {},
    create: {
      id: "seed-strategy-1",
      name: "ETH Momentum Mirror",
      description: "Mirrors large ETH spot entries from alpha wallet",
      sourceWalletId: wallet.id,
      status: StrategyStatus.ACTIVE,
      minCapitalUsd: 500,
      rulesJson: {
        type: "mirror",
        minTradeUsd: 10000,
        assets: ["ETH"],
        maxSlippageBps: 50,
      },
    },
  });

  await prisma.indexerCursor.upsert({
    where: { id: "main" },
    update: { block: 19000000n, chainId: 1 },
    create: { id: "main", chainId: 1, block: 19000000n },
  });

  console.log("Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
