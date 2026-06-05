"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";
import { projectId } from "@/config/appkit";
import { Wallet } from "lucide-react";

function ConnectWalletButtonInner() {
  const { open } = useAppKit();
  const { address: appKitAddress, isConnected: appKitConnected } =
    useAppKitAccount();
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();

  const address = appKitAddress ?? wagmiAddress;
  const isConnected = appKitConnected || wagmiConnected;

  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => open()}
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        {shortenAddress(address)}
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={() => open()} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}

export function ConnectWalletButton() {
  if (!projectId) {
    return (
      <Button
        size="sm"
        disabled
        title="Set VITE_WALLETCONNECT_PROJECT_ID in .env"
      >
        Connect Wallet
      </Button>
    );
  }

  return <ConnectWalletButtonInner />;
}
