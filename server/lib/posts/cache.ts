import watch from 'node-watch';

import { blogPostsDir } from '../../../lib/constants';

import { getPostFilenames } from './files';
import { Post, getPostData } from './post';

export const handledFilesCache: Record<string, Post> = {};

const handleFile = async (file: string) => {
	// Update cache
	const post = await getPostData(file);
	handledFilesCache[file] = post;
}

// Hack to await data extracting and to prevent data extracting while export objects by nextjs
let initEnd: () => void;
export const initPostsHandlePromise = new Promise<void>(async (done) => {
	initEnd = done;
});

// Handle all files
export const initCache = async () => {
	console.log('INIT CACHE');

	// Update files
	watch(blogPostsDir, { recursive: true, persistent: false }, (_, file) => {
		console.log('CHANGE FILE', file);
		handleFile(file);
	});

	const files = await getPostFilenames();
	await Promise.all(files.map((file) => handleFile(file)));
	initEnd();
}