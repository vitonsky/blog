import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { visit } from "unist-util-visit";
import getReadingTime from "reading-time";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { readFile, stat } from "fs/promises";

import { getPostUrlByFilename } from "./files";

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

export const getPostData = async (filename: string): Promise<Post> => {
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

// TODO: implement it when will setup API server to build data
// const extractFilenames = async () => {
// 	// Don't handle draft files
// 	const unlistedPaths = Boolean(process.env.SHOW_DRAFTS)
// 		? []
// 		: [blogPostsDir + "/_drafts/**"];

// 	// Get all posts
// 	const files = await getFilenamesInDir(
// 		blogPostsDir + "/**/*.!(md|mdx)",
// 		unlistedPaths
// 	);

// 	const filenames: Record<string, string> = {};

// 	await Promise.all(files.map(async (filename) => {
// 		const absolutePath = path.resolve(filename);
// 		const extension = path.extname(filename);

// 		const fd = await readFile(filename);
// 		const hash = createHash('sha256').update(fd).digest('hex');

// 		filenames[absolutePath] = hash + extension;
// 	}))


// 	return filenames;
// }