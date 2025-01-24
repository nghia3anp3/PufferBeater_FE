import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
  },
  // Cấu hình fallback
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  preview: {
    port: 3000,
  },
  // Cấu hình SPA fallback
  esbuild: {
    jsx: "automatic",
  },
});
