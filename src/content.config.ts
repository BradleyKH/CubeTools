import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const tutorials = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tutorials' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Slug of a series in `src/data/tutorials.ts`. */
    series: z.string(),
    order: z.number(),
    navTitle: z.string().optional(),
    /** Legacy root filename, e.g. `cfop3.html`; drives the old-URL redirects. */
    legacy: z.string().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
    legacy: z.string().optional(),
  }),
});

export const collections = { tutorials, guides };
