import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/ws": {
        target: "http://localhost:8081",
        changeOrigin: true,
        ws: true,
      },
      "/oauth2": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/login": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      // OPS: proxy actuator calls to backend during local dev
      "/actuator": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },
});
