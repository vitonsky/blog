// TODO: move this logic to HTTP server and use as API, 
// to cache posts instead parse all posts for each page

import { promise as glob } from "glob-promise";
import { serialize } from "next-mdx-remote/serialize";
import { visit } from "unist-util-visit";

import path from "path";

import { readFile, stat } from "fs/promises";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { blogPostsDir } from "./constants";

export const getPostFilenamesInDir = (directory: string) => {
	return glob(`${directory}/**/*.{md,mdx}`);
};

export const parsePost = async (text: string) => {
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

	const mdxSource = await serialize(text, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [extractPreviewTextPlugin],
		},
	});

	if (previewText === null) {
		throw new TypeError("Preview text are empty");
	}

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

	return {
		meta,
		mdxSource,
		previewText,

		title,
		image: typeof meta.image === "string" ? meta.image : null,
		lang: typeof meta.lang === "string" ? meta.lang : null,
		tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
		keywords: Array.isArray(meta.keywords) ? (meta.keywords as string[]) : [],
	};
};

export const getPostUrlByFilename = (filePath: string) => {
	// remove prefix
	let pageUrl = filePath.slice(blogPostsDir.length);

	// remove extension
	const fileExtension = path.extname(pageUrl);
	if (fileExtension.length > 0) {
		pageUrl = pageUrl.slice(0, -fileExtension.length);
	}

	return "/blog" + pageUrl;
};

export type Post = {
	url: string;
	date: number;

	title: string;
	previewText: string;
	tags: string[];
	keywords: string[];
	lang: string | null;
	image: string | null;

	source: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getPost = async (filename: string): Promise<Post> => {
	const url = getPostUrlByFilename(filename);

	const mdFile = await readFile(filename);
	const postSource = mdFile.toString();
	const { mdxSource, previewText, title, image, tags, keywords, lang } =
		await parsePost(postSource);

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
	};
};

export const getPosts = async (options?: {
	from?: number;
	limit?: number;
	tag?: string;
	lang?: string;
	sort?: 'asc' | 'desc'
}) => {
	const { tag, lang, sort = 'desc', from = 0, limit } = options || {};

	// Get all posts
	const files = await getPostFilenamesInDir(blogPostsDir);
	let posts: Post[] = await Promise.all(
		files.map((filename) => getPost(filename))
	);

	// Apply filter
	if (tag !== undefined || lang !== undefined) {
		posts = posts.filter((post) => {
			if (tag !== undefined && post.tags.indexOf(tag) === -1) return false;
			if (lang !== undefined && post.lang !== lang) return false;

			return true;
		});
	}

	// Sort
	posts = posts.sort((p1, p2) => sort === 'desc' ? p2.date - p1.date : p1.date - p2.date);

	// Slice
	posts = posts.slice(from, limit);

	return posts;
};
