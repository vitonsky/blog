import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

import { parseCustomDate } from './utils/date';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: '../posts/', pattern: '**/*.mdx' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Transform string to Date object
			date: z.string().transform((rawDate) => {
				const date = parseCustomDate(rawDate);
				if (date === null) throw new Error(`Can't parse date ${rawDate}`);

				return date;
			}),
			description: z.string().nullish(),
			image: image().nullish(),
			tags: z
				.string()
				.array()
				.nullish()
				.transform((list) => list ?? []),
			keywords: z
				.string()
				.array()
				.nullish()
				.transform((list) => list ?? []),
		}),
});

const pages = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './pages/', pattern: '**/*.mdx' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			image: image().optional(),
			keywords: z
				.string()
				.array()
				.nullish()
				.transform((list) => list ?? []),
		}),
});

export const collections = { blog, pages };
