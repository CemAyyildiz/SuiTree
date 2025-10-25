import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";
import { RegisterEnokiWallets } from "./RegisterEnokiWallets.tsx";

const queryClient = new QueryClient();

console.log('🚀 SuiTree starting...');
console.log('📦 Backend URL:', import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001');
console.log('🔑 Enoki API Key:', import.meta.env.VITE_ENOKI_API_KEY ? '✓ Configured' : '✗ Missing');
console.log('🔑 Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Missing');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          {/* Register Enoki wallets before WalletProvider */}
          <RegisterEnokiWallets />
          <WalletProvider autoConnect>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);
