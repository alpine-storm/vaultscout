import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { prisma } from "../../infrastructure/database/prisma";
import { env } from "../../config/env";

export class IndexerService {
  private client = createPublicClient({
    chain: mainnet,
    transport: http(env.RPC_URL_MAINNET ?? mainnet.rpcUrls.default.http[0]),
  });

  async runOnce(): Promise<number> {
    const cursor = await prisma.indexerCursor.findUnique({ where: { id: "main" } });
    if (!cursor) return 0;

    const fromBlock = cursor.block + 1n;
    const latest = await this.client.getBlockNumber();
    const toBlock = fromBlock + 5n > latest ? latest : fromBlock + 5n;

    if (fromBlock > latest) return 0;

    const wallets = await prisma.trackedWallet.findMany({
      where: { chainId: 1 },
      select: { id: true, address: true },
    });

    const addressSet = new Set(wallets.map((w) => w.address.toLowerCase()));
    let indexed = 0;

    for (let block = fromBlock; block <= toBlock; block++) {
      const blockData = await this.client.getBlock({
        blockNumber: block,
        includeTransactions: true,
      });

      for (const tx of blockData.transactions) {
        if (typeof tx === "string") continue;
        const from = tx.from.toLowerCase();
        const to = tx.to?.toLowerCase();
        const wallet = wallets.find(
          (w) => w.address.toLowerCase() === from || w.address.toLowerCase() === to
        );
        if (!wallet || !addressSet.has(wallet.address.toLowerCase())) continue;

        await prisma.walletTransaction.upsert({
          where: { hash_chainId: { hash: tx.hash, chainId: 1 } },
          update: {},
          create: {
            walletId: wallet.id,
            hash: tx.hash,
            chainId: 1,
            fromAddress: tx.from,
            toAddress: tx.to ?? "0x0000000000000000000000000000000000000000",
            value: tx.value.toString(),
            action: from === wallet.address.toLowerCase() ? "SEND" : "RECEIVE",
            blockNumber: block,
            timestamp: new Date(Number(blockData.timestamp) * 1000),
          },
        });
        indexed++;
      }
    }

    await prisma.indexerCursor.update({
      where: { id: "main" },
      data: { block: toBlock },
    });

    return indexed;
  }
}
