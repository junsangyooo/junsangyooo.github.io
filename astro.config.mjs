// @ts-check
import { defineConfig } from 'astro/config';

// Static output → Cloudflare Pages serves /dist. Site URL drives canonical + sitemap later.
export default defineConfig({
  site: 'https://github.jsyoo.dev',
  output: 'static',
  prefetch: true,
});
