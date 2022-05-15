import { handledFilesCache, initPostsHandlePromise } from "./cache";
import { getPostFilenameByUrl, getPostFilenames, getPostUrlByFilename } from "./files";
import { Post, getPostData } from "./post";

export * from './post';

export const getPostUrls = async () => {
	const files = await getPostFilenames();
	return files.map((file) => getPostUrlByFilename(file));
};

export const getPost = async (url: string): Promise<Post> => {
	const path = getPostFilenameByUrl(url);
	return getPostData(path);
}

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
	await initPostsHandlePromise;
	let posts: Post[] = Object.values(handledFilesCache);

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

