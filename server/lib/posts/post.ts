import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { visit } from 'unist-util-visit';
import getReadingTime from 'reading-time';
import colors from 'colors';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

import { readFile, stat } from 'fs/promises';

import { extractTimestampFromName, getPostUrlByFilename } from './files';
import path from 'path';

export type Post = {
	url: string;
	date: number;

	title: string;
	description: string | null;
	previewText: string;
	tags: string[];
	keywords: string[];
	lang: string | null;

	/**
	 * Image extracted from post to insert in meta tags
	 * Prefer to `previewImage` if specified
	 */
	coverImage: string | null;

	/**
	 * Image specified manually in metadata
	 */
	previewImage: string | null;

	source: MDXRemoteSerializeResult<Record<string, unknown>>;
	readingTime: {
		minutes: number;
		words: number;
	};
};

export type PostWithAdditionalData = Post & {
	additionalData: {
		html: string;
	};
};

export const isUrl = (filename: string) => /^[a-z]*:\/\//i.test(filename);
export const isRelativePath = (filename: string) => /^[^\/]/.test(filename);
export const isLocalAttachmentUrl = (filename: string) =>
	!isUrl(filename) && isRelativePath(filename);

const getAttachment = (filename: string, attachments: Record<string, string>) => {
	try {
		const absolutePath = path.resolve(filename);
		const fileUrl = attachments[absolutePath];
		return fileUrl ?? null;
	} catch (error) {
		// Ignore
	}

	return null;
};

// TODO: refactor data extraction
// TODO: refactor metadata extraction
export const parsePost = async (
	text: string,
	{ filename, attachments }: { filename: string; attachments: Record<string, string> },
) => {
	let previewText: string | null = null;
	const extractPreviewTextPlugin = () => (node: any) => {
		visit(node, 'paragraph', (paragraph) => {
			if (previewText !== null) return;

			const texts: string[] = [];
			visit(paragraph, 'text', (node) => {
				texts.push(node.value);
			});

			if (texts.length > 0) {
				previewText = texts.join('\n\n');
			}
		});
	};

	let pageText: string = '';
	const extractTextPlugin = () => (node: any) => {
		visit(node, ['text'], (node) => {
			pageText += node.value;
		});
	};

	let coverImage: string | null = null;
	const extractImagePlugin = () => (node: any) => {
		visit(node, 'image', (node) => {
			const { url } = node;
			if (!url || coverImage !== null) return;
			coverImage = url;
		});
	};

	let mdast: any;
	const extractTree = () => (node: any) => {
		mdast = node;
	};

	const replaceAttachmentsLinks = () => (node: any) => {
		visit(node, (node) => {
			if (!('url' in node) || typeof node.url !== 'string') return;
			if (!isLocalAttachmentUrl(node.url)) return;

			const fullPath = path.join(path.dirname(filename), node.url);
			const fileUrl = getAttachment(fullPath, attachments);
			if (fileUrl !== null) {
				node.url = fileUrl;
			} else {
				console.log(
					colors.yellow(
						`Invalid relative URL "${node.url}" in post "${filename}"`,
					),
				);
			}
		});
	};

	const mdxSource = await serialize(text, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [
				replaceAttachmentsLinks,
				extractPreviewTextPlugin,
				extractTextPlugin,
				extractImagePlugin,
				remarkGfm,
				extractTree,
			],
			rehypePlugins: [rehypeHighlight],
		},
	});

	const mdastToHTML = async (node: any) => {
		const mdast = await remark().use(remarkRehype).use(rehypeStringify).run(node);
		const result = await remark()
			.use(remarkRehype)
			.use(rehypeStringify)
			.stringify(mdast);
		return result;
	};

	const html = await mdastToHTML(mdast);

	if (previewText === null) {
		throw new TypeError('Preview text are empty');
	}

	// ReadTimeResults
	const { minutes, words } = getReadingTime(pageText);

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

	let date = extractTimestampFromName(path.basename(filename));
	if (date === null) {
		throw new Error('Post filename must contain publish data in format Y-m-d');
	}

	const { time } = meta;
	if (!time || typeof time !== 'string') {
		throw new TypeError('Time are empty. Specify in in format hh:mm');
	} else {
		const parsedTime = time.match(/(\d{1,2}):(\d{1,2})/);
		if (parsedTime === null || parsedTime.length !== 3) {
			throw new TypeError('Cannot parse time. Specify in in format hh:mm');
		}

		const hours = parseInt(parsedTime[1]);
		const minutes = parseInt(parsedTime[2]);

		if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
			throw new TypeError('Cannot parse time. Specify in in format hh:mm');
		}

		const dateObject = new Date(date);
		dateObject.setHours(hours, minutes);
		date = dateObject.getTime();
	}

	// Resolve image URL
	let previewImage = typeof meta.image === 'string' ? meta.image : null;
	if (previewImage !== null && isLocalAttachmentUrl(previewImage)) {
		const fullPath = path.join(path.dirname(filename), previewImage);
		const url = getAttachment(fullPath, attachments);

		if (url === null) {
			console.log(
				colors.yellow(
					`Invalid cover image URL "${previewImage}" in post "${filename}"`,
				),
			);
		}

		// Set correct URL or null
		previewImage = url;
	}

	if (previewImage !== null) {
		coverImage = previewImage;
	}

	return {
		meta,
		mdxSource,
		previewText,
		readingTime: { minutes, words },
		date,

		title,
		previewImage,
		coverImage,
		description: typeof meta.description === 'string' ? meta.description : null,
		lang: typeof meta.lang === 'string' ? meta.lang : null,
		tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
		keywords: Array.isArray(meta.keywords) ? (meta.keywords as string[]) : [],

		additionalData: {
			html,
		},
	};
};

export const getPostData = async (
	filename: string,
	attachments: Record<string, string>,
): Promise<PostWithAdditionalData> => {
	const url = getPostUrlByFilename(filename);

	const mdFile = await readFile(filename);
	const postSource = mdFile.toString();
	const {
		meta,
		mdxSource: source,
		...postData
	} = await parsePost(postSource, { filename, attachments });

	// Delete meta
	delete source.frontmatter;

	// Prevent unnecessary props forwarding
	type StrictProps<X, Y> = { [K in keyof X]: K extends keyof Y ? X[K] : never };
	const exactPostData: StrictProps<typeof postData, PostWithAdditionalData> = postData;

	return {
		url,
		source,
		...exactPostData,
	};
};
