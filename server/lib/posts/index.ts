import { parsedPosts, initPostsHandlePromise } from './cache';
import { Post, PostWithAdditionalData } from './post';

export * from './post';

export const getPostUrls = async () => {
	await initPostsHandlePromise;
	return Object.keys(parsedPosts);
};

export const getPostWithAdditionalData = async (
	url: string,
): Promise<PostWithAdditionalData | null> => {
	await initPostsHandlePromise;

	const post = parsedPosts[url];
	return post === undefined ? null : post.data;
};

export const getPost = async (url: string): Promise<Post | null> => {
	const post = await getPostWithAdditionalData(url);

	if (post === null) return null;

	const { additionalData, ...postData } = post;
	return postData;
};

export const getPosts = async ({
	tag,
	lang,
	sort = 'desc',
	from = 0,
	limit,
}: {
	from?: number;
	limit?: number;
	tag?: string;
	lang?: string;
	sort?: 'asc' | 'desc';
} = {}) => {
	await initPostsHandlePromise;
	let posts: Post[] = Object.values(parsedPosts).map(({ data }) => data);

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
		sort === 'desc' ? p2.date - p1.date : p1.date - p2.date,
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
