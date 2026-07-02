import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/n-tillbaka.spel/',
  server: {
    watch: {
      usePolling: true,
    },
  },
});
