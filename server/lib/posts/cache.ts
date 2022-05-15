import watch from 'node-watch';

import path from 'path';
import { createHash } from 'crypto';
import { readFile, rm } from 'fs/promises';

import { attachmentsPath, blogPostsDir, publicDir } from '../../../lib/constants';
import { cp, isExistFile } from '../files';

import { getAttachmentFilenames, getPostFilenames } from './files';
import { Post, getPostData } from './post';

export const parsedPosts: Record<string, Post> = {};
const handleFile = async (file: string) => {
	const absolutePath = path.resolve(file);

	if (!await isExistFile(file)) {
		delete parsedPosts[absolutePath];
		return;
	}

	// Update cache
	const post = await getPostData(file, extractedAttachments);

	parsedPosts[absolutePath] = post;
}

export const extractedAttachments: Record<string, string> = {};
export const handleAttachment = async (filename: string) => {
	const absolutePath = path.resolve(filename);
	const extension = path.extname(filename);

	const updatePosts = () => Promise.all(Object.keys(parsedPosts).map(handleFile));

	if (!await isExistFile(filename)) {
		const filePath = extractedAttachments[absolutePath];

		if (filePath !== undefined) {
			// TODO: ensure that not remove file if file with same hash exist in other directory
			await rm(path.join(publicDir, filePath));
			delete extractedAttachments[absolutePath];

			await updatePosts();
		}

		return;
	}

	const fd = await readFile(filename);
	const hash = createHash('sha256').update(fd).digest('hex');
	const filePath = path.join(attachmentsPath, hash + extension);

	// TODO: don't upload files which not used in posts
	// TODO: ensure that not rewrite files while hash collisions
	// Copy and write
	const pathToCopy = path.join(publicDir, filePath);
	await cp(absolutePath, pathToCopy);

	extractedAttachments[absolutePath] = filePath;

	await updatePosts();
}

// Hack to await data extracting and to prevent data extracting while export objects by nextjs
let initEnd: () => void;
export const initPostsHandlePromise = new Promise<void>(async (done) => {
	initEnd = done;
});

// Handle all files
export const initCache = async () => {
	// Update files
	watch(blogPostsDir, { recursive: true, persistent: false }, async (_, file) => {
		const extension = path.extname(file);
		if (['.md', '.mdx'].indexOf(extension) !== -1) {
			handleFile(file);
		} else {
			handleAttachment(file);
		}
	});

	// Clear dir to remove unnecessary files
	const attachmentsDir = path.join(publicDir, attachmentsPath);
	await rm(attachmentsDir, { force: true, recursive: true });

	const attachments = await getAttachmentFilenames();
	await Promise.all(attachments.map(handleAttachment));

	const posts = await getPostFilenames();
	await Promise.all(posts.map((file) => handleFile(file)));
	initEnd();
}