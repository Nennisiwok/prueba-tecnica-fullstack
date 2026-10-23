import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8000',
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
