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
*One repo = one file. You add content — never code.*

</div>

---

## ✨ What it is

A blog-style gallery for **code**, separate from my general portfolio at [jsyoo.dev](https://jsyoo.dev).
The landing page lays out repos as zig-zag article cards; each opens a `/{repo}` detail page that
tells the project as **Problem · Approach · Outcome**.

The whole thing is **data-driven**: the list, the per-repo routes, and the filter tabs are all
generated from content files. Adding a project means dropping **one file + one thumbnail** — the
schema (`src/content.config.ts`, enforced by [zod](https://zod.dev)) fails the build loudly if a
field is missing.

> Motion is borrowed in spirit from Cuberto — inertia scroll (Lenis), an ink cursor, rolling-text
> links, convex-fill buttons, and smooth View Transitions — but every effect is a *progressive
> enhancement*: content is visible by default, so nothing is ever held hostage by JS.

## 📁 Add a project

Three ways, in order of power:

| Way | Best for | How |
|-----|----------|-----|
| **`/showcase` skill** | rich pages (Claude Code) | knows the schema, tokens & blocks → writes a polished `.mdx` |
| **`/console`** | quick edits from any device | password CMS → single-commit deploy |
| **By hand** | full control | drop a file in `src/content/projects/` + a thumbnail |

<details>
<summary><b>Frontmatter contract</b> (click to expand)</summary>

```yaml
---
title: "Nyom"                       # required
tagline: "Local restaurants, matched by taste — not stars."  # required · one line
category: "Websites"                # Websites | Applications | Tools  (drives the filter tabs)
thumbnail: "/thumbnails/nyom.png"   # required · path under public/
role: "Product · Frontend"          # optional
team: 3                             # default 1  (1 → "Solo", 2+ → "Team of N")
year: 2025                          # required
stack: ["Next.js", "Supabase"]      # optional
repo: "https://github.com/..."      # optional → "View on GitHub ↗"
links:                              # optional → extra buttons
  - { label: "Live demo", url: "https://..." }
featured: false
order: 0                            # lower = higher in the list (newest = 0)
---
## Problem … ## Approach … ## Outcome
```

The full body vocabulary (markdown + the content blocks) lives in **[`CONTENT.md`](CONTENT.md)**.
</details>

## 🧩 Content blocks (MDX)

`.mdx` bodies can use a small, design-system-aware block set — no raw HTML, no off-brand styling:

| Block | Use |
|-------|-----|
| `<Callout>` | a key insight or caveat |
| `<Figure>` | a captioned screenshot |
| `<TwoUp>` | two images side by side (before / after) |
| `<Stat>` | a row of outcome metrics |
| `<Video>` | a responsive YouTube / Vimeo / mp4 embed |

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

## 💻 Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → dist/
npm run preview
```

> The `/console` calls Pages Functions, which `astro dev` doesn't run. To test it locally:
> `npm run build && npx wrangler pages dev dist`.

## 🚀 Deploy

Push to `main` → **Cloudflare Pages** builds (`npm run build` → `dist`, Node 22) and ships to
`github.jsyoo.dev` in ~1 minute. The `/console` commits content back to this repo via the GitHub
Git Data API as a single atomic commit, which then triggers the same auto-deploy.

## 📄 License

[MIT](LICENSE) © Junsang Yoo
