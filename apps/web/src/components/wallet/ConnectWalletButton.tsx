"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Button variant="outline" size="sm" onClick={() => disconnect()}>
        {shortenAddress(address)}
      </Button>
    );
  }

  const connector = connectors[0];
  if (!connector) {
    return (
      <Button size="sm" disabled>
        No wallet
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => connect({ connector })}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
