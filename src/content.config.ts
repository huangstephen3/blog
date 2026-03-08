import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			draft: z.boolean().default(false),
			featured: z.boolean().default(false),
			premium: z.boolean().default(false),
			category: z.string().default('AI快讯'),
			tags: z.array(z.string()).default([]),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };
