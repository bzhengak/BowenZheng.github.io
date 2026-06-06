import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// GitHub Pages 用户/组织页面: 根路径部署
export default defineConfig({
    plugins: [react()],
    base: '/',
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
