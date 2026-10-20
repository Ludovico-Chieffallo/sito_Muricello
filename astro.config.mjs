import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sito statico: ogni pagina viene generata in HTML al momento della build.
export default defineConfig({
  site: 'https://muricello.it',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
