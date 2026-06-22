import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One markdown file per repo. Add a repo = drop a file in src/content/projects/.
// The zod schema is the contract — a missing/invalid field fails the build loudly.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    // Drives the filter tabs. Add a value here and it shows up as a filter automatically.
    category: z.enum(['Websites', 'Applications', 'Branding']),
    thumbnail: z.string(), // path under /public, e.g. "/thumbnails/nyom.svg"
    // Controls the card image shape → gives the zigzag grid masonry variety.
    ratio: z.enum(['portrait', 'landscape', 'square']).default('portrait'),
    role: z.string().optional(),
    team: z.number().default(1),
    year: z.number(),
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(999), // lower = higher in the list
  }),
});

export const collections = { projects };
