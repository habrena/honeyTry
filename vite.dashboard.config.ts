import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src/dashboard/front',
  build: {
    outDir: '../../../dashboard-dist',  // outputs to project-root/dashboard-dist
    emptyOutDir: true,
  },
  server: {
    port: 5174,  // dev server on a different port than the honeypot's Vite
    proxy: {
      '/api/dashboard': 'http://127.0.0.1:3002',
    },
  },
});