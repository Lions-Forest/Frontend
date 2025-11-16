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
      includeAssets: ["src/assets/lions-forest.ico", "src/assets/icons/favicon.png"],
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
            src: "/assets/icons/favicon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/assets/icons/favicon.png",
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
