import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy animation libs into their own chunk for better caching/perf
        manualChunks: {
          motion: ["framer-motion"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
