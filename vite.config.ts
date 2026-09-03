import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'src/front',       // where your React code lives
  build: {
    outDir: '../../dist',   // output to honeyTry/dist (relative to root)
    emptyOutDir: true,
  },
});