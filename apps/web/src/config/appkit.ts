import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, base } from "@reown/appkit/networks";
import { createStorage } from "wagmi";

export const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "";

export const networks = [mainnet, arbitrum, base];

export const appKitMetadata = {
  name: "VaultScout",
  description: "Track profitable on-chain wallets and subscribe to strategies",
  url: import.meta.env.VITE_APP_URL ?? "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: localStorage }),
  ssr: false,
  projectId,
  networks,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
