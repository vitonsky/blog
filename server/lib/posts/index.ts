import { Post, PostWithAdditionalData } from '../../../common/Post';

import { RawPosts } from './RawPosts';

export * from './post';

export class Posts {
	private readonly rawPosts: RawPosts;
	constructor(rawPosts: RawPosts) {
		this.rawPosts = rawPosts;
	}

	public getPostUrls = async () => {
		const posts = await this.rawPosts.getPosts();
		return Object.keys(posts);
	};

	public getPostWithAdditionalData = async (
		url: string,
	): Promise<PostWithAdditionalData | null> => {
		const posts = await this.rawPosts.getPosts();

		const post = posts[url];
		return post === undefined ? null : post.data;
	};

	public getPost = async (url: string): Promise<Post | null> => {
		const post = await this.getPostWithAdditionalData(url);

		if (post === null) return null;

		const { additionalData, ...postData } = post;
		return postData;
	};

	public getPosts = async ({
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
		const parsedPosts = await this.rawPosts.getPosts();
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

	public getPaginationInfo = async ({
		itemsOnPage,
		tag,
		lang,
	}: {
		itemsOnPage: number;
		tag?: string;
		lang?: string;
	}) => {
		const postsNumber = (await this.getPosts({ tag, lang })).length;
		const pagesNumber = Math.ceil(postsNumber / itemsOnPage);

		return { postsNumber, pagesNumber };
	};
}
