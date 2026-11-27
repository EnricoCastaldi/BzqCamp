import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = name => fileURLToPath(new URL(name, import.meta.url));

export default defineConfig(({ mode }) => {
  const standalone = mode === 'configurator';
  return {
    plugins: standalone ? [{
      name: 'configurator-homepage',
      enforce: 'post',
      generateBundle(_options, bundle) {
        const html = bundle['konfigurator.html'];
        if (!html) this.error('Configurator HTML was not built');
        delete bundle['konfigurator.html'];
        html.fileName = 'index.html';
        bundle['index.html'] = html;
      },
    }] : [],
    build: {
      outDir: standalone ? 'dist-configurator' : 'dist',
      rollupOptions: {
        input: standalone ? page('./konfigurator.html') : {
          storefront: page('./index.html'),
          renowacje: page('./renowacje.html'),
          budowa: page('./budowa.html'),
          kontakt: page('./kontakt.html'),
          configurator: page('./konfigurator.html'),
        },
      },
    },
  };
});
