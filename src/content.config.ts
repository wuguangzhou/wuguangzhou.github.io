import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    category: z.enum(['开源项目', '独立开发']),
    role: z.string().optional(),
    techStack: z.array(z.string()).optional().default([]),
    url: z.string().optional(),
    description: z.string(),
  }),
});

export const collections = { blog, portfolio };
