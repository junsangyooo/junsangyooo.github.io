import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One markdown file per repo. Add a repo = drop a file in src/content/projects/.
// The zod schema is the contract — a missing/invalid field fails the build loudly.
const projects = defineCollection({
  // both .md (console / simple) and .mdx (skill / rich blocks) render from one collection
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    // Free-form, multi-tag. Drives the filter tabs, which are generated dynamically
    // from the union of every project's types — add a new type and a tab appears.
    // Default [] keeps the build alive for an untyped file (it just shows under "All").
    types: z.array(z.string()).default([]),
    // legacy: a single `category` string (pre-multi-tag). Auto-folded into types below,
    // so an old file drops in and renders without any hand-editing.
    category: z.string().optional(),
    thumbnail: z.string(), // path under /public, e.g. "/thumbnails/nyom.svg"
    role: z.string().optional(),
    team: z.number().default(1),
    year: z.number(),
    stack: z.array(z.string()).default([]),
    // tolerate empty string from the console (blank optional field)
    repo: z.union([z.string().url(), z.literal('')]).optional(),
    // extra custom buttons (label + url) shown on the detail page
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(999), // lower = higher in the list
  }).transform((d) => {
    // Backward-compat: fold a legacy single `category` into `types` (Title Case)
    // when no `types` were given. New files use `types` directly and skip this.
    if (!d.types.length && d.category) {
      d.types = [d.category.trim().replace(/\s+/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())];
    }
    return d;
  }),
});

export const collections = { projects };
