import { EnokiFlowConfig } from "@mysten/enoki/react";

export const enokiFlowConfig: EnokiFlowConfig = {
  apiKey: import.meta.env.VITE_ENOKI_API_KEY,
  network: "testnet", // veya "mainnet"
};

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

