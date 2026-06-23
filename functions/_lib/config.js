// Backend single source of truth for the GitHub target. Cloudflare Pages Functions
// run as plain JS (separate runtime from the Astro/src bundle), so the repo slug lives
// here for the api/* handlers; the frontend keeps its mirror in src/config/site.ts.
export const REPO = 'junsangyooo/junsangyooo.github.io';
export const BRANCH = 'main';
export const GH = 'https://api.github.com';
