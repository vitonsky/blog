import { getCollection, type CollectionEntry } from 'astro:content';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { visit } from 'unist-util-visit';
import getReadingTime, { type ReadTimeResults } from 'reading-time';
import { undefined } from 'astro:schema';


export const getPostPreviewText = (text: string) => {
	const tree = fromMarkdown(text);

	let previewText: string | null = null;
	visit(tree, 'paragraph', (paragraph) => {
		if (previewText !== null) return;

		const texts: string[] = [];
		visit(paragraph, 'text', (node) => {
			texts.push(node.value);
		});

		if (texts.length > 0) {
			previewText = texts.join('\n\n');
		}
	});

	return previewText;
};

export type BlogPost = (CollectionEntry<'blog'> & {
	previewText: null | string;
	readingTime: ReadTimeResults;
});

export const getBlogPosts = async ({ tag }: { tag?: string } = {}): Promise<BlogPost[]> => {
	const collection = await getCollection(
		'blog',
		tag
			? (item) => (item.data.tags ?? []).some((postTag) => postTag === tag)
			: (undefined as never),
	)

	return collection.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map((post) => ({
			...post,
			previewText: post.body ? getPostPreviewText(post.body) : null,
			readingTime: getReadingTime(post.body ?? '', {}),
		}));
}