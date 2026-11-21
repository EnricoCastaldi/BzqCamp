import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        storefront: fileURLToPath(new URL('./index.html', import.meta.url)),
        configurator: fileURLToPath(new URL('./konfigurator.html', import.meta.url)),
      },
    },
  },
});
