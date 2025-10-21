﻿import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/images': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
