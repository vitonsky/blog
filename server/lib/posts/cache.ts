// TODO: use SQLite instead of own implementation of storage

import watch from 'node-watch';

import path from 'path';
import { createHash } from 'crypto';
import { readFile, rm } from 'fs/promises';

import { PostWithAdditionalData } from '../../../common/Post';
import { attachmentsPath, publicDir } from '../../constants';

import { cp, isExistFile } from '../files';
import { blogPostsDir } from '../../constants';

import { getAttachmentFilenames, getPostFilenames, getPostUrlByFilename } from './files';
import { getPostData } from './post';

export const parsedPosts: Record<
	string,
	{
		file: string;
		data: PostWithAdditionalData;
	}
> = {};
const handleFile = async (file: string) => {
	const url = getPostUrlByFilename(file);
	const absolutePath = path.resolve(file);

	if (!(await isExistFile(file))) {
		delete parsedPosts[url];
		return;
	}

	try {
		// Update cache
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const post = await getPostData(file, extractedAttachments);

		parsedPosts[url] = {
			file: absolutePath,
			data: post,
		};
	} catch (error) {
		delete parsedPosts[url];
		console.error(error);
	}
};

export const extractedAttachments: Record<string, string> = {};
export const handleAttachment = async (filename: string) => {
	const absolutePath = path.resolve(filename);
	const extension = path.extname(filename);

	const updatePosts = () =>
		Promise.all(Object.values(parsedPosts).map(({ file }) => handleFile(file)));

	if (!(await isExistFile(filename))) {
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
};

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
};
