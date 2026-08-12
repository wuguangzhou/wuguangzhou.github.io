import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
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
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    description: z.string(),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: z.object({
    bio: z.string(),
    extendedBio: z.string(),
    motto: z.string(),
    techStack: z.array(z.string()).optional().default([]),
    currentlyDoing: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { blog, portfolio, about };
