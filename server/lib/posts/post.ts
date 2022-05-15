import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { visit } from "unist-util-visit";
import getReadingTime from "reading-time";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import colors from "colors";

import { readFile, stat } from "fs/promises";

import { getPostUrlByFilename } from "./files";
import path from "path";

export type Post = {
	url: string;
	date: number;

	title: string;
	// TODO: add `description` property
	previewText: string;
	tags: string[];
	keywords: string[];
	lang: string | null;
	image: string | null;

	source: MDXRemoteSerializeResult<Record<string, unknown>>;
	readingTime: {
		minutes: number;
		words: number;
	};
};

const isUrl = (filename: string) => /^[a-z]*:\/\//i.test(filename);
const isRelativePath = (filename: string) => /^[^\/]/.test(filename);
const isLocalAttachmentUrl = (filename: string) => !isUrl(filename) && isRelativePath(filename);

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


export const parsePost = async (
	text: string,
	{
		filename,
		attachments,
	}: { filename: string; attachments: Record<string, string> }
) => {
	let previewText: string | null = null;
	const extractPreviewTextPlugin = () => (node: any) => {
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
	};

	let pageText: string = "";
	const extractTextPlugin = () => (node: any) => {
		visit(node, ["text", "code"], (node) => {
			pageText += node.value;
		});
	};

	const replaceAttachmentsLinks = () => (node: any) => {
		visit(node, (node) => {
			if (!("url" in node) || typeof node.url !== "string") return;
			if (!isLocalAttachmentUrl(node.url)) return;

			const fullPath = path.join(path.dirname(filename), node.url);
			const fileUrl = getAttachment(fullPath, attachments);
			if (fileUrl !== null) {
				node.url = fileUrl;
			} else {
				console.log(
					colors.yellow(
						`Invalid relative URL "${node.url}" in post "${filename}"`
					)
				);
			}
		});
	};

	const mdxSource = await serialize(text, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [
				extractPreviewTextPlugin,
				extractTextPlugin,
				replaceAttachmentsLinks,
				remarkGfm,
			],
			rehypePlugins: [rehypeHighlight],
		},
	});

	if (previewText === null) {
		throw new TypeError("Preview text are empty");
	}

	// ReadTimeResults
	const { minutes, words } = getReadingTime(pageText);

	const meta = mdxSource.frontmatter;
	if (!meta) {
		throw new Error("Metadata are empty");
	} else if (typeof meta !== "object" || Array.isArray(meta)) {
		throw new TypeError("Metadata is have unexpected type");
	}

	const title = meta.title;
	if (!title || typeof title !== "string") {
		throw new TypeError("Title are empty");
	}

	// Resolve image URL
	let image = typeof meta.image === "string" ? meta.image : null;
	if (image !== null && isLocalAttachmentUrl(image)) {
		const fullPath = path.join(path.dirname(filename), image);
		const url = getAttachment(fullPath, attachments);

		if (url === null) {
			console.log(
				colors.yellow(
					`Invalid cover image URL "${image}" in post "${filename}"`
				)
			);
		}

		// Set correct URL or null
		image = url;
	}

	return {
		meta,
		mdxSource,
		previewText,
		readingTime: { minutes, words },

		title,
		// TODO: handle relative urls
		image,
		lang: typeof meta.lang === "string" ? meta.lang : null,
		tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
		keywords: Array.isArray(meta.keywords) ? (meta.keywords as string[]) : [],
	};
};

export const getPostData = async (
	filename: string,
	attachments: Record<string, string>
): Promise<Post> => {
	const url = getPostUrlByFilename(filename);

	const mdFile = await readFile(filename);
	const postSource = mdFile.toString();
	const {
		mdxSource,
		previewText,
		title,
		image,
		tags,
		keywords,
		lang,
		readingTime,
	} = await parsePost(postSource, { filename, attachments });

	const { birthtime } = await stat(filename);

	return {
		url,
		date: birthtime.getTime(),

		title,
		previewText,
		image,
		source: mdxSource,
		tags,
		keywords,
		lang,
		readingTime,
	};
};
