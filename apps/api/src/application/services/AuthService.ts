import { randomBytes } from "crypto";
import { SiweMessage } from "siwe";
import { prisma } from "../../infrastructure/database/prisma";
import { env } from "../../config/env";

export class AuthService {
  async getNonce(walletAddress: string): Promise<string> {
    const normalized = walletAddress.toLowerCase();
    const nonce = randomBytes(16).toString("hex");

    await prisma.user.upsert({
      where: { walletAddress: normalized },
      update: { nonce },
      create: { walletAddress: normalized, nonce },
    });

    return nonce;
  }

  async verifySiwe(message: string, signature: string): Promise<{ token: string; userId: string }> {
    const siwe = new SiweMessage(message);
    const fields = await siwe.verify({
      signature,
      domain: env.SIWE_DOMAIN,
    });

    const walletAddress = fields.data.address.toLowerCase();
    const user = await prisma.user.findUnique({ where: { walletAddress } });

    if (!user?.nonce || user.nonce !== fields.data.nonce) {
      throw new Error("Invalid nonce");
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.session.create({
        data: { userId: user.id, token, expiresAt },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { nonce: null },
      }),
    ]);

    return { token, userId: user.id };
  }

  async getUserByToken(token: string) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  }
}
