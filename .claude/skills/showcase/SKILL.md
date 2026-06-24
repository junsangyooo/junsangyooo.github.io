---
name: showcase
description: Add or edit a project on github.jsyoo.dev (this repo). Use when the user wants to put a GitHub repo on the showcase, write/refresh a project detail page, or turn rough notes about a repo into a polished, design-consistent entry. Knows the schema, design system, the 5 content blocks, asset paths, and the deploy flow.
---

# /showcase — project-aware authoring for github.jsyoo.dev

You are authoring content for THIS repo: a Cuberto-style GitHub projects showcase
(Astro 5 static → Cloudflare Pages). **One repo = one body file + one thumbnail.**
Everything is data-driven — NEVER hand-edit list/route/filter code; a content file is enough.

## When to use
- "쇼케이스에 ○○ 레포 추가", "이 프로젝트 상세 써줘", "노트 정리해서 올려줘", edit an existing entry.

## Read first (the contract)
1. **`CONTENT.md`** (repo root) — single source of truth for frontmatter + the body vocabulary + the 5 blocks (with exact import lines). Follow it literally.
2. `src/content.config.ts` — the zod schema (enforced at build; a bad field fails loudly).
3. `CLAUDE.md` §5 (content model), §6 (tokens), §7 (motion) — for tone/feel.

## Output (one file + assets, COMMITTED but NOT pushed)
- Body: `src/content/projects/{slug}.mdx` (use `.mdx` for rich blocks; `.md` is fine for plain text).
- Thumbnail: `public/thumbnails/{slug}.{ext}` — 1:1 reads best on the cards.
- Body images: `public/uploads/{name}.{ext}` → referenced via `![](...)` or `<Figure src="..." />`.
- `slug` = filename, lowercase-kebab.

## Workflow
1. **Gather.** Ask for the repo (URL or name) + rough notes/bullets. If a URL is given, read the
   README to ground the writeup (`gh repo view OWNER/REPO --json ...` or WebFetch the repo page).
   Infer `types` (free-form multi-tag, Title Case, ≥1 — e.g. `["Websites", "AI"]`), `year`, `stack`, `role`, `team`.
2. **Draft frontmatter** per the schema. New entry → `order: 0` (newest on top). One-line `tagline`,
   punchy, concrete. Don't invent fields the schema doesn't have.
3. **Write the body** in the site's editorial voice — calm, concrete, lightly first-person, no fluff,
   no emoji. Default arc: `## Problem` / `## Approach` / `## Outcome`. Reach for a block only when it
   earns its place:
   - `<Callout title="...">` — one key insight or caveat.
   - `<Figure src="/uploads/.." caption="..." />` — a captioned screenshot.
   - `<TwoUp a=".." b=".." caption="..." />` — before/after or two views.
   - `<Stat items={[{value:"3×", label:"faster"}]} />` — outcome metrics.
   - `<Video src="https://youtu.be/.." />` — a demo.
   Import each block you use at the TOP of the `.mdx` (exact paths are in CONTENT.md §3).
4. **Images.**
   - **Thumbnail (always generated this one way).** Hand the `visual-image-create` skill the FIXED
     prompt below, replacing ONLY `[PROJECT TOPIC]`. Never edit any other word of it. Save the single
     returned PNG to `public/thumbnails/{slug}.png` (1:1). This is the only allowed way to make a
     thumbnail — do not write SVGs or hand-craft one.

     > Design a sleek editorial-style square project thumbnail for [PROJECT TOPIC], inspired by modern tech/product visuals. Create it in a 1:1 aspect ratio. Use soft 3D elements, floating UI cards, clean geometry, lots of whitespace, pastel-neutral tones, and subtle shadows. Make it feel premium, friendly, refined, and lightweight. No text, no logos, no clutter.

     **Deriving `[PROJECT TOPIC]` (the crux).** The topic is NOT a description, feature list, or tech
     stack — it's the project's *recognizable visual subject*, the "ah, this is it" point a glance can
     read. Pick the concrete real-world thing or genre the project is *about*, as a short lowercase
     noun phrase (≈2–5 words). When in doubt, ask: "if I drew this on a card with no text, what one
     subject says what it is?" Strip everything else (engine, framework, MVC, full-stack, etc.).
     - `cpp-chess-engine` (a C++ chess engine) → **a chess game**
     - `dragon_slayer` (a Unity 2D roguelike) → **a roguelike dungeon adventure game**
     - `roll_over_kimbap` (a kimbap brand storefront) → **a Korean kimbap food brand store**
     - `email-blast` (a Next.js email campaign tool) → **an email marketing campaign tool**
     - `portfolio-dashboard` (a crypto trading bot) → **a crypto trading dashboard**
   - **Body figures (`/uploads/...`).** These are NOT the fixed prompt — they're real screenshots /
     captures of the project, or, if none exist yet, clean on-brand SVG placeholders the user can swap
     later (match the tokens; label them as placeholders).
5. **Validate.** Run `npm run build`. The zod schema + MDX compile catch mistakes. Fix until green.
6. **Stage.** `git add` the new/changed files and present a ready commit message. **Do NOT push** —
   the user pushes; Cloudflare auto-deploys on push (~1 min).

## Guardrails
- Design tokens & effects are fixed (CLAUDE.md §6/§7). Never invent colors or new effects — use the
  5 blocks + plain markdown only.
- Don't touch list/route/filter code, the schema, or the console. Content files are the whole job.
- Keep the tagline one line; keep the body tight and skimmable; match the existing tone.
- After build is green, report what you wrote (files + a one-line summary) and stop at staged.
