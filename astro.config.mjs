// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Static output → Cloudflare Pages serves /dist. Site URL drives canonical + sitemap later.
// mdx() lets project bodies use the reusable content blocks (src/components/content/*).
export default defineConfig({
  site: 'https://github.jsyoo.dev',
  output: 'static',
  prefetch: true,
  integrations: [mdx()],
});
