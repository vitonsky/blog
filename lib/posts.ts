// TODO: move this logic to HTTP server and use as API,
// to cache posts instead parse all posts for each page

import { promise as glob } from "glob-promise";

import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { } from "next/app";
import { serialize } from "next-mdx-remote/serialize";
import { visit } from "unist-util-visit";
import getReadingTime from "reading-time";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import path from "path";

import { readFile, stat } from "fs/promises";

import { blogPostsDir, siteInfo } from "./constants";

export const getPostFilenamesInDir = (
	directory: string | string[],
	ignore: string[] = []
) => {
	// Don't handle draft files
	const unlistedPaths = Boolean(process.env.SHOW_DRAFTS)
		? []
		: [blogPostsDir + "/_drafts/**"];

	const directories = Array.isArray(directory) ? directory : [directory];
	return Promise.all(
		directories.map((directory) =>
			glob(`${directory}/**/*.{md,mdx}`, {
				ignore: [...unlistedPaths, ...ignore],
			})
		)
	).then((results) => {
		const postFilenames = new Set<string>();
		results.forEach((filenames) => {
			filenames.forEach((filename) => {
				postFilenames.add(filename);
			});
		});

		return Array.from(postFilenames);
	});
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

	let pageText: string = "";
	const extractTextPlugin = () => (node: any) => {
		visit(node, ["text", "code"], (node) => {
			pageText += node.value;
		});
	};

	const mdxSource = await serialize(text, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [extractPreviewTextPlugin, extractTextPlugin, remarkGfm],
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

	return {
		meta,
		mdxSource,
		previewText,
		readingTime: { minutes, words },

		title,
		image: typeof meta.image === "string" ? meta.image : null,
		lang: typeof meta.lang === "string" ? meta.lang : null,
		tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
		keywords: Array.isArray(meta.keywords) ? (meta.keywords as string[]) : [],
	};
};

export const getPostUrlByFilename = (filePath: string) => {
	const fileRealpath = path.resolve(filePath);
	const postsDirRealpath = path.resolve(blogPostsDir);

	// remove prefix
	let pageUrl = fileRealpath.slice(postsDirRealpath.length);

	// remove extension
	const fileExtension = path.extname(pageUrl);
	if (fileExtension.length > 0) {
		pageUrl = pageUrl.slice(0, -fileExtension.length);
	}

	return siteInfo.blogPath + pageUrl;
};

export const getPostFilenameByUrl = (url: string) => {
	const relativePath = path.join(
		blogPostsDir,
		url.slice(siteInfo.blogPath.length) + ".md"
	);
	return path.resolve(relativePath);
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
	readingTime: {
		minutes: number;
		words: number;
	};
};

export const getPost = async (filename: string): Promise<Post> => {
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
	} = await parsePost(postSource);

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

export const getPosts = async ({
	tag,
	lang,
	sort = "desc",
	from = 0,
	limit,
}: {
	from?: number;
	limit?: number;
	tag?: string;
	lang?: string;
	sort?: "asc" | "desc";
} = {}) => {
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
	posts = posts.sort((p1, p2) =>
		sort === "desc" ? p2.date - p1.date : p1.date - p2.date
	);

	// Slice
	posts = posts.slice(from, limit ? from + limit : undefined);

	return posts;
};

export const getPaginationInfo = async ({
	itemsOnPage,
	tag,
	lang,
}: {
	itemsOnPage: number;
	tag?: string;
	lang?: string;
}) => {
	const postsNumber = (await getPosts({ tag, lang })).length;
	const pagesNumber = Math.ceil(postsNumber / itemsOnPage);

	return { postsNumber, pagesNumber };
};
