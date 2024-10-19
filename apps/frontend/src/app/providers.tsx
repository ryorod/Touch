"use client";
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
    <PrivyProvider appId="cm2bujjkh01vi12igdsyc0v14" config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
