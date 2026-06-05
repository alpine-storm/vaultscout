import { useEffect, useRef } from "react";
import { createAppKit } from "@reown/appkit/react";
import { mainnet } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit-common";
import {
  appKitMetadata,
  networks,
  projectId,
  wagmiAdapter,
} from "@/config/appkit";

const appKitNetworks = networks as unknown as [
  AppKitNetwork,
  ...AppKitNetwork[],
];

export function AppKitInit() {
  const started = useRef(false);

  useEffect(() => {
    if (!projectId || started.current) return;
    started.current = true;

    createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: appKitNetworks,
      defaultNetwork: mainnet,
      metadata: appKitMetadata,
      themeMode: "dark",
      themeVariables: {
        "--w3m-accent": "#10b981",
        "--w3m-border-radius-master": "16px",
      },
      features: {
        analytics: false,
        email: true,
        socials: ["google"],
        emailShowWallets: true,
        connectMethodsOrder: ["wallet", "email", "social"],
        swaps: false,
        onramp: false,
      },
      enableCoinbase: false,
      allWallets: "SHOW",
      enableWalletGuide: true,
    });
  }, []);

  return null;
}
