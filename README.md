<div align="center">

# GitHub Projects

#### what · why · how — repo by repo

[![Astro](https://img.shields.io/badge/Astro-5-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![MDX](https://img.shields.io/badge/MDX-1B1F24?logo=mdx&logoColor=white)](https://mdxjs.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.13-0AE448?logo=greensock&logoColor=white)](https://gsap.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-4f46e5)](#-license)

**[Live → github.jsyoo.dev](https://github.jsyoo.dev)** &nbsp;·&nbsp; **[About → jsyoo.dev](https://jsyoo.dev)**

<br/>

*An editorial, [Cuberto](https://cuberto.com)-inspired showcase of my public GitHub repos.*
*One repo = one file. Add content, never code.*

</div>

---

## ✨ What it is

A blog-style gallery for **code**, kept separate from my general portfolio at [jsyoo.dev](https://jsyoo.dev).
The landing page lays repos out as zig-zag article cards; each opens a `/{repo}` detail page that
tells the project as **Problem · Approach · Outcome**.

The whole thing is **data-driven**. The list, the per-repo routes, and the filter tabs are all
generated from content files — add a project by dropping **one file + one thumbnail**. The schema
(`src/content.config.ts`, enforced by [zod](https://zod.dev)) fails the build loudly if a field is
missing, and the filter tabs are derived from the union of every project's `types`, so a new tag
appears automatically with no code change.

> Motion is borrowed in spirit from Cuberto — inertia scroll (Lenis), an ink cursor, rolling-text
> links, convex-fill buttons, and smooth View Transitions — but every effect is a *progressive
> enhancement*: content is visible by default, so nothing is ever held hostage by JS.

## 📁 Adding & managing projects

Authoring and management are deliberately split — **bodies are authored as code; the console only
touches metadata.** This keeps the CMS free of any HTML/MDX authoring surface (see [Security](#-security)).

| Task | Tool | Notes |
|------|------|-------|
| **Write a new project** | **`/showcase` skill** or by hand | Produces a polished `.mdx` (or `.md`) — schema, tokens, and content blocks aware |
| **Reorder · edit metadata · delete** | **`/console`** | Password-protected dashboard → single atomic commit. Never edits the body |
| **Drop-in by hand** | your editor | One file in `src/content/projects/` + a thumbnail under `public/thumbnails/` |

<details>
<summary><b>Frontmatter contract</b> (click to expand)</summary>

```yaml
---
title: "Nyom"                       # required
tagline: "Local restaurants, matched by taste — not stars."  # required · one line
types: ["Websites", "AI"]           # required (≥1) · free-form, multi-tag, Title-Cased
                                    #   filter tabs are generated from the union of all types
thumbnail: "/thumbnails/nyom.png"   # required · path under public/
role: "Product · Frontend"          # optional
team: 3                             # default 1  (1 → "Solo", 2+ → "Team of N")
year: 2025                          # required
stack: ["Next.js", "Supabase"]      # optional
repo: "https://github.com/..."      # optional → "View on GitHub ↗"
links:                              # optional → extra buttons
  - { label: "Live demo", url: "https://..." }
featured: false
order: 0                            # list position (lower = higher). The console manages this
                                    #   via drag-free ↑/↓ reordering; ties fall back to newest year
---
## Problem … ## Approach … ## Outcome
```

A legacy single `category:` field is auto-folded into `types` (Title-Cased) at build time and on
console load, so older files keep working untouched. The full body vocabulary (markdown + content
blocks) lives in **[`CONTENT.md`](CONTENT.md)**.
</details>

## 🧩 Content blocks (MDX)

`.mdx` bodies can use a small, design-system-aware block set — **no raw HTML, no off-brand styling**:

| Block | Use |
|-------|-----|
| `<Callout>` | a key insight or caveat |
| `<Figure>` | a captioned screenshot |
| `<TwoUp>` | two images side by side (before / after) |
| `<Stat>` | a row of outcome metrics |
| `<Video>` | a responsive YouTube / Vimeo / mp4 embed (unknown URLs degrade to a safe link) |

## 🛠 Stack

| Layer | Tech |
|-------|------|
| Framework | **Astro 5** (static output) |
| Content | **Content Collections** (`{md,mdx}` glob + zod) |
| Rich body | **@astrojs/mdx** + reusable content blocks |
| Styling | **Pure CSS** — tokens in `src/styles/tokens.css`, no Tailwind |
| Type | **Geist / Geist Mono** |
| Motion | **GSAP 3.13** (ScrollTrigger, SplitText) + **Lenis** smooth scroll |
| Transitions | **Astro View Transitions** (`ClientRouter`) |
| CMS | custom password **console** on **Cloudflare Pages Functions** |
| Hosting | **Cloudflare Pages** → `github.jsyoo.dev` |

## 🗂 Structure

```
src/
├── content/projects/*.{md,mdx}   # one file per repo  (the whole content model)
├── content.config.ts             # zod schema — the field contract
├── pages/                        # index · [slug] · 404 · console
├── components/                   # Header, Footer, ProjectCard, Roll
│   └── content/                  # MDX blocks: Callout, Figure, TwoUp, Stat, Video
├── lib/                          # cursor, smoothScroll, reveal, filters
├── config/site.ts                # site identity (single source)
└── styles/                       # tokens.css + global.css
functions/                        # Cloudflare Pages Functions — the /console backend (/api/*)
docs/                             # preserved legacy (not built)
```

## 🔒 Security

The console is a password-protected CMS that commits to this repo, so it is designed defensively:

- **Secrets never reach the client.** The fine-grained `GITHUB_TOKEN` and `CONSOLE_PASSWORD` live
  only in Cloudflare Pages environment variables — never in the bundle, never in the repo. The
  browser never sees the token; **every** GitHub write is proxied through Pages Functions.
- **Signed, server-verified sessions.** Login checks the password, then issues an `HttpOnly` session
  cookie signed with a PBKDF2 (100k-iteration) key — or a separate high-entropy `SESSION_SECRET` if
  provided, fully decoupling the signing key from the password. Every `/api/*` write re-verifies it.
- **No authoring surface in the CMS.** The console edits **metadata and ordering only** — it never
  composes page bodies. Bodies are authored as code and preserved byte-for-byte on save, so the CMS
  introduces **no stored-XSS / MDX-injection path**, and a console edit can't break the build.
- **Upload hardening.** Image writes are constrained to fixed prefixes by allow-list regex
  (`/uploads/…`, `/thumbnails/…`), reject path traversal (`..`), and are validated by **magic-byte
  sniffing** — not by file extension alone.
- **Brute-force friction.** Failed logins are delayed (~800 ms); the real ceiling is a Cloudflare WAF
  rate-limit rule on `/api/login`. The console is marked `noindex`.
- **Atomic, auditable writes.** Each deploy is a single Git commit (blob → tree → commit), so every
  content change is reviewable in `git` history.
- **Least privilege.** The PAT is fine-grained and scoped to **Contents: Read/Write on this repo only**.

> **Required env (Cloudflare Pages → Settings → Variables, Production):** `CONSOLE_PASSWORD`,
> `GITHUB_TOKEN`. Optional but recommended: `SESSION_SECRET` (`openssl rand -hex 32`).

## 💻 Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → dist/
npm run preview
```

> `/console` calls Pages Functions, which `astro dev` doesn't run. To exercise it locally:
> `npm run build && npx wrangler pages dev dist` (with the env vars above set).

## 🚀 Deploy

Push to `main` → **Cloudflare Pages** builds (`npm run build` → `dist`, Node 22) and ships to
`github.jsyoo.dev` in ~1 minute. The console commits content back to this repo through the GitHub
Git Data API as one atomic commit, which triggers the same auto-deploy.

## 📄 License

[MIT](LICENSE) © Junsang Yoo
