'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  sepolia,
  unichain
} from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// You'll need to get a project ID from WalletConnect Cloud
const projectId = "d328cb87d39eef9ebaff55956a57c45e";

export const config = getDefaultConfig({
  appName: 'Zero-Delta Euler',
  projectId,
  chains: [sepolia, unichain],
  ssr: false, 
});

const queryClient = new QueryClient();
console.log("queryClient", queryClient)

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