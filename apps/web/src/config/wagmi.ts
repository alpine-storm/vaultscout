"use client";

import { http, createConfig } from "wagmi";
import { mainnet, arbitrum, base } from "wagmi/chains";
import { metaMask } from "wagmi-connectors/metamask";
import { walletConnect } from "wagmi-connectors/walletconnect";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo-project-id";

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, base],
  connectors: [
    metaMask(),
    walletConnect({ projectId, showQrModal: true }),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});
