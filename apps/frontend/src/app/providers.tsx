"use client";
import { PRIVY_APP_ID } from "@/constants/config";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { skaleCalypsoTestnet } from "viem/chains";
import { http } from "wagmi";

const queryClient = new QueryClient();

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: [
    "wallet",
    "email",
    "sms",
    "google",
    "twitter",
    "discord",
    "github",
    "linkedin",
    "tiktok",
    "farcaster",
  ],
  appearance: {
    showWalletLoginFirst: true,
  },
  supportedChains: [skaleCalypsoTestnet],
  defaultChain: skaleCalypsoTestnet,
};

const wagmiConfig = createConfig({
  chains: [skaleCalypsoTestnet],
  transports: {
    [skaleCalypsoTestnet.id]: http(),
  },
});

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
