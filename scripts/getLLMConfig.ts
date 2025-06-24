import 'dotenv/config';

import { z } from 'zod';

export const getLLMConfig = () =>
	z
		.object({
			token: z.string(),
			model: z.string().optional().default('openai/gpt-4o-mini'),
		})
		.parse({
			token: process.env.LLM_TOKEN,
			model: process.env.LLM_MODEL,
		});
