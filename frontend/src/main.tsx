import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";
import { enokiFlowConfig } from "./enokiConfig.ts";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <EnokiFlowProvider {...enokiFlowConfig}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
            <WalletProvider autoConnect>
              <App />
            </WalletProvider>
          </SuiClientProvider>
        </EnokiFlowProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);
