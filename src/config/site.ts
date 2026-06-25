// Single source of truth for the site's identity / chrome (name, links, intro copy).
// Project CONTENT is data-driven via src/content/projects/*.md — this file is only the
// fixed shell around it. Frontend (Astro components + /console) import from here.
// Backend (Cloudflare Functions, plain JS) reads the repo/branch from functions/_lib/config.js.
export const site = {
  brand: 'Junsang Yoo',
  domain: 'github.jsyoo.dev',
  portfolioUrl: 'https://jsyoo.dev',
  repo: 'junsangyooo/junsangyooo.github.io',
  branch: 'main',
  footerTagline: 'An open notebook of what I build — repo by repo.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/junsangyooo' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/junsang-yoo-305288227/' },
    // Email split into user/domain so the literal address never appears in static HTML
    // (avoids Cloudflare email obfuscation rewriting it to /cdn-cgi/l/email-protection).
    // The mailto: href is assembled at runtime in scripts/main.ts.
    { label: 'Email', mail: ['jsyoo.dev', 'gmail.com'] },
  ],
  intro: {
    title: 'GitHub Projects',
    subtitle: "Things I've built — a running log, from first commit to now.",
  },
};
