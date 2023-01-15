import { MDXRemoteSerializeResult } from 'next-mdx-remote';

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
