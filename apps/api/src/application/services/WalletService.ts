import type { IWalletRepository } from "../../domain/repositories/IWalletRepository";

export class WalletService {
  constructor(private readonly walletRepo: IWalletRepository) {}

  listTopWallets() {
    return this.walletRepo.findAllPublic();
  }

  getWallet(id: string) {
    return this.walletRepo.findById(id);
  }

  trackWallet(input: {
    address: string;
    label?: string;
    chainId: number;
    userId?: string;
  }) {
    return this.walletRepo.create({
      address: input.address,
      label: input.label,
      chainId: input.chainId,
      addedById: input.userId,
    });
  }
}
