import 'dotenv/config';

import { Command } from 'commander';
import OpenAI from 'openai';
import path from 'path';
import { z } from 'zod';

import { readFile } from 'fs/promises';
import { getLLMConfig } from './getLLMConfig';

async function proofread(content: string): Promise<string> {
	const llm = getLLMConfig();

	const openai = new OpenAI({
		baseURL: llm.baseUrl,
		apiKey: llm.token,
	});

	const resp = await openai.chat.completions.create({
		model: llm.model,
		messages: [
			{
				role: 'system',
				content:
					'You are a proofreader for a blog about software engineering. Your purpose is to find an unclear things in blog post, improve post style to keep readers attention, correct text to make it spicy and use modern but professional language and terms. You must never change tone of blog post. Your report must be a list of your notes about how to improve text. Report must be in markdown format, each thesis must be a new heading. Notes must be short but clear, you may suggest short changes in block quotes. If you cannot suggest significant improvements or questions - you must say it straight. No any other comments in your response.',
			},
			{
				role: 'system',
				content:
					'Also start your message from section "Suggested titles" with list of 20 good titles for this post to engage people to read blog post. Suggested titles must be spicy and a bit aggressive and not friendly but not to have vulgar words like "shit"/"crap" or something like that. Also suggested titles must not be pussy like "Say goodbye to X" or "The Silent Killers of User Experience", "The Unwanted Guests", etc it is too stupid and too pussy - it must be professional, but little toxic.',
			},
			{ role: 'user', content },
		],
		temperature: 1,
	});

	return resp.choices[0].message?.content ?? content;
}

const program = new Command();

program
	.name('reviewer')
	.description('Review blog post and get advices')
	.argument('<file>', 'Markdown file path')
	.action(async function (...args) {
		const [file] = z
			.tuple([z.string().min(1, 'File path is required')])
			.rest(z.any())
			.parse(args);

		const fullPath = path.resolve(file);
		const original = await readFile(fullPath, 'utf-8');
		const review = await proofread(original);

		console.log(review);
	});

program.parse();
