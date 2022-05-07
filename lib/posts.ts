import { promise as glob } from 'glob-promise';
import { serialize } from 'next-mdx-remote/serialize';
import { visit } from 'unist-util-visit';

import path from 'path';

import { blogPostsDir } from './constants';

export const getAllPostsInDir = (directory: string) => {
	return glob(`${directory}/**/*.{md,mdx}`);
}

export const parsePost = async (text: string) => {
	let previewText: string | null = null;

	const mdxSource = await serialize(text, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [
				() => (node) => {
					visit(node, "paragraph", (paragraph) => {
						if (previewText !== null) return;

						let texts: string[] = [];
						visit(paragraph, "text", (node) => {
							texts.push(node.value);
						});

						if (texts.length > 0) {
							previewText = texts.join("\n\n");
						}
					});
				},
			],
		},
	});

	if (previewText === null) {
		throw new TypeError('Preview text are empty');
	}

	const meta = mdxSource.frontmatter;
	if (!meta) {
		throw new Error('Metadata are empty');
	} else if (typeof meta !== 'object' || Array.isArray(meta)) {
		throw new TypeError('Metadata is have unexpected type');
	}

	const title = meta.title;
	if (!title || typeof title !== 'string') {
		throw new TypeError('Title are empty');
	}

	return {
		meta,
		mdxSource,
		previewText,

		title,
		image: typeof meta.image === 'string' ? meta.image : null,
		tags: Array.isArray(meta.tags) ? meta.tags : null,
		keywords: Array.isArray(meta.keywords) ? meta.keywords : null,
	}
}

export const getPostUrlByFilename = (filePath: string) => {
	// remove prefix
	let pageUrl = filePath.slice(blogPostsDir.length);

	// remove extension
	const fileExtension = path.extname(pageUrl);
	if (fileExtension.length > 0) {
		pageUrl = pageUrl.slice(0, -fileExtension.length);
	}

	return '/blog' + pageUrl;
}