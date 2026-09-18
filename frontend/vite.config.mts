import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'build',
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
