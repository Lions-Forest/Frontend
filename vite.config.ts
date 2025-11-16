import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["src/assets/lions-forest.ico"],
      manifest: {
        name: "모여봐요 사자의숲",
        short_name: "사자의숲",
        description: "모여봐요 사자의숲 PWA",
        start_url: "/",
        display: "standalone",
        background_color: "#E4F2EA",
        theme_color: "#E4F2EA",
        icons: [
          {
            src: "/lions-forest.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
