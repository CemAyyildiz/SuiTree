import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Match Google OAuth redirect URI
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
  define: {
    'global': 'globalThis',
  },
});
