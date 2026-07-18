/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    // Transform every *.svg import into a React component (default export),
    // matching the prior @svgr/webpack behaviour (`import Icon from './x.svg'`).
    svgr({ include: '**/*.svg', svgrOptions: { exportType: 'default' } }),
    tailwindcss(),
  ],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // SVGs are transformed to components by vite-plugin-svgr in tests too.
  },
});
