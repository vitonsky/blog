import 'dotenv/config';

import OpenAI from 'openai';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { readFile, writeFile } from 'fs/promises';

interface Args {
	file: string;
	write: boolean;
}

async function proofread(content: string): Promise<string> {
	const openai = new OpenAI({
		baseURL: 'https://cryptotalks.ai/v1',
		apiKey: process.env.LLM_TOKEN,
	});
	const resp = await openai.chat.completions.create({
		model: 'openai/gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: `
					You are a proofreader. Fix grammar and style, preserve markdown. Do not add any comments and only return fixed markdown text.

					You must never replace computer terms.
					You must never add a dots at end of lists.

					Do not use character ";", prefer comma instead.

					You must never change the tone of text. If text is a bit aggressive, you must leave this style.
					You must never up promises. If text promises "to make great", you must never replace it to something like "to ensure great".
					
					You must not never move a dot inside quotemark like that \`"foo bar."\` as fix for \`"foo bar".\`
					`,
			},
			{ role: 'user', content },
		],
		temperature: 0,
	});
	return resp.choices[0].message?.content ?? content;
}

async function main(): Promise<void> {
	const { file, write } = yargs(hideBin(process.argv))
		.options({
			file: {
				type: 'string',
				demandOption: true,
				alias: 'f',
				desc: 'Markdown file path',
			},
			write: {
				type: 'boolean',
				alias: 'w',
				default: false,
				desc: 'Pass to write fixes at file',
			},
		})
		.parseSync() as Args;

	const original = await readFile(file, 'utf-8');
	const fixed = await proofread(original);

	if (fixed.trim() === original.trim()) {
		console.log('No changes needed.');
		return;
	}

	console.log('--- Proofread Output ---\n');
	console.log(fixed);

	if (write) {
		await writeFile(file, fixed, 'utf-8');
		console.log(`File updated: ${file}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
