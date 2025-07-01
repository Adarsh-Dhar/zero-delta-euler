'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  sepolia,
} from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// You'll need to get a project ID from WalletConnect Cloud
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID";

export const config = getDefaultConfig({
  appName: 'Zero-Delta Euler',
  projectId,
  chains: [sepolia],
  ssr: true, 
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 