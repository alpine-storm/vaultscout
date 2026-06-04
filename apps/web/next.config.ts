import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    const nobleHashes = path.resolve(
      __dirname,
      "../../node_modules/viem/node_modules/@noble/hashes"
    );
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "../../node_modules"),
      ...(Array.isArray(config.resolve.modules) ? config.resolve.modules : []),
      "node_modules",
    ];
    const wagmiConnectors = path.resolve(
      __dirname,
      "../../node_modules/@wagmi/connectors/dist/esm"
    );
    config.resolve.alias = {
      ...config.resolve.alias,
      "@noble/hashes": nobleHashes,
      "@noble/hashes/hmac": path.join(nobleHashes, "hmac.js"),
      "@noble/hashes/utils": path.join(nobleHashes, "utils.js"),
      "@noble/hashes/legacy": path.join(nobleHashes, "legacy.js"),
      "wagmi-connectors/metamask": path.join(wagmiConnectors, "metaMask.js"),
      "wagmi-connectors/walletconnect": path.join(
        wagmiConnectors,
        "walletConnect.js"
      ),
    };
    return config;
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
