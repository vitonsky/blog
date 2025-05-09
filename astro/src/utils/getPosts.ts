import { type CollectionEntry, getCollection } from 'astro:content';
import { fromMarkdown } from 'mdast-util-from-markdown';
import getReadingTime, { type ReadTimeResults } from 'reading-time';
import { visit } from 'unist-util-visit';

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

export type BlogPost = CollectionEntry<'blog'> & {
	previewText: null | string;
	readingTime: ReadTimeResults;
};

const enrichPostData = (post: CollectionEntry<'blog'>) => ({
	...post,
	previewText: post.body ? getPostPreviewText(post.body) : null,
	readingTime: getReadingTime(post.body ?? '', {}),
});

export const getBlogPosts = async ({ tag }: { tag?: string } = {}): Promise<
	BlogPost[]
> => {
	const collection = await getCollection(
		'blog',
		tag
			? (item) => (item.data.tags ?? []).some((postTag) => postTag === tag)
			: undefined,
	);

	return collection
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
		.map(enrichPostData);
};

// TODO: infer text embeddings and consider similarity search score
export const getRelatedBlogPosts = async (
	sourcePost: CollectionEntry<'blog'>,
	limit = 10,
): Promise<BlogPost[]> => {
	const { tags } = sourcePost.data;

	const collection = await getCollection('blog').then((collection) =>
		collection.filter((item) => item.id !== sourcePost.id && item.data.image),
	);

	if (!tags || tags.length === 0) {
		// Sort in random order if can't found related
		collection.sort(() => (Math.random() > 0.5 ? -1 : 1));
	} else {
		// Ranking by most matched attributes
		const tagsSet = new Set(tags);
		const countMatchedTags = (tags: string[] = []) =>
			tags.reduce((counter, tag) => counter + (tagsSet.has(tag) ? 1 : 0), 0);
		collection.sort(
			(a, b) => countMatchedTags(b.data.tags) - countMatchedTags(a.data.tags),
		);
	}

	return collection.slice(0, limit).map(enrichPostData);
};
