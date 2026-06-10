import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 项目页面: 子路径部署
export default defineConfig({
  plugins: [react()],
  base: '/BowenZheng.github.io/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 5173,
    host: true,
  },
});
