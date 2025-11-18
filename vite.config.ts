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
      // public/icons 에 있는 정적 아이콘들을 그대로 복사
      includeAssets: ["icons/icon-192x192.png", "icons/icon-512x512.png"],
      manifest: {
        name: "모여봐요 사자의숲",
        short_name: "모사숲",
        description: "모여봐요 사자의숲 PWA",
        start_url: "/",
        display: "standalone",
        background_color: "#E4F2EA",
        theme_color: "#E4F2EA",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
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
