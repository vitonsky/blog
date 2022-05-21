import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { readFile, access, writeFile } from 'fs/promises';

export const isExistFile = (file: string) =>
	access(file)
		.then(() => true)
		.catch(() => false);

export const cp = async (source: string, destination: string) => {
	function ensureDirectoryExistence(filePath: string) {
		const dirname = path.dirname(filePath);
		if (existsSync(dirname)) {
			return true;
		}
		ensureDirectoryExistence(dirname);
		mkdirSync(dirname);
	}

	ensureDirectoryExistence(destination);

	const originalFile = await readFile(source);
	await writeFile(destination, originalFile);
};
