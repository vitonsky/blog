import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { readFile, access, writeFile } from 'fs/promises';

export const isExistFile = (file: string) =>
	access(file)
		.then(() => true)
		.catch(() => false);

export function ensureDirectoryExistence(filePath: string) {
	const dirname = path.dirname(filePath);
	if (existsSync(dirname)) {
		return;
	}

	ensureDirectoryExistence(dirname);
	mkdirSync(dirname);
}

export const cp = async (source: string, destination: string) => {
	ensureDirectoryExistence(destination);

	const originalFile = await readFile(source);
	await writeFile(destination, originalFile);
};
