import { createHash } from 'crypto';
import path from 'path';
import sharp from 'sharp';

import { PostWithAdditionalData } from '../../../common/Post';
import { attachmentsPath, publicDir } from '../../constants';

import { cp, ensureDirectoryExistence, isExistFile } from '../files';
import { readFile, rm } from 'fs/promises';
import { getPostUrlByFilename } from './files';
import { getPostData } from './post';

const getImageExtension = (filePath: string) => {
	const extensionsMap = {
		png: /\.(png)$/i,
		jpg: /\.(jpg|jpeg)$/i,
	} as const;

	let imageExtension: null | keyof typeof extensionsMap = null;
	for (const extension in extensionsMap) {
		const regex = extensionsMap[extension as keyof typeof extensionsMap];
		const isExtensionMatch = regex.test(filePath);
		if (isExtensionMatch) {
			imageExtension = extension as keyof typeof extensionsMap;
			break;
		}
	}

	return imageExtension;
};

async function copyFile(filePath: string, pathToCopy: string) {
	ensureDirectoryExistence(pathToCopy);

	// Optimize images
	const imageExtension = getImageExtension(filePath);
	if (imageExtension !== null) {
		console.log('Optimize image', filePath);

		const fileBuffer = await readFile(filePath);
		switch (imageExtension) {
			case 'png':
				await sharp(fileBuffer)
					.png({ compressionLevel: 9, quality: 100 })
					.toFile(pathToCopy);
				break;
			case 'jpg':
				await sharp(fileBuffer)
					.jpeg({ progressive: true, quality: 80, mozjpeg: true })
					.toFile(pathToCopy);
				break;
		}

		return;
	}

	// Just copy another files
	return await cp(filePath, pathToCopy);
}

export class PostsContext {
	public readonly parsedPosts: Record<
		string,
		{
			file: string;
			data: PostWithAdditionalData;
		}
	> = {};
	public handleFile = async (file: string) => {
		const absolutePath = path.resolve(file);

		console.log('Process file', absolutePath);

		const url = getPostUrlByFilename(file);

		if (!(await isExistFile(file))) {
			delete this.parsedPosts[url];
			return;
		}

		// Update cache
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const post = await getPostData(file, this.extractedAttachments);

		this.parsedPosts[url] = {
			file: absolutePath,
			data: post,
		};
	};

	public readonly extractedAttachments: Record<string, string> = {};
	public handleAttachment = async (filename: string) => {
		const absolutePath = path.resolve(filename);
		const extension = path.extname(filename);

		const updatePosts = () =>
			Promise.all(
				Object.values(this.parsedPosts).map(({ file }) => this.handleFile(file)),
			);

		if (!(await isExistFile(filename))) {
			const filePath = this.extractedAttachments[absolutePath];

			if (filePath !== undefined) {
				// TODO: ensure that not remove file if file with same hash exist in other directory
				await rm(path.join(publicDir, filePath));
				delete this.extractedAttachments[absolutePath];

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
		await copyFile(absolutePath, pathToCopy);

		this.extractedAttachments[absolutePath] = filePath;

		await updatePosts();
	};
}
