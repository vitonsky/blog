import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { parseCustomDate } from './utils/date';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: '../posts/', pattern: '**/*.mdx' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		// TODO: use actual scheme
		title: z.string(),
		description: z.string().optional().default(""),
		// Transform string to Date object
		date: z.string().transform((rawDate) => {
			const date = parseCustomDate(rawDate);
			if (date === null) throw new Error(`Can't parse date ${rawDate}`);

			return date;
		}),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		tags: z.string().array().optional(),
	}),
});

export const collections = { blog };
