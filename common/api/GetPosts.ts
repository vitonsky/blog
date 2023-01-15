export type GetPostsRequest = {
	from?: number;
	limit?: number;
	tag?: string;
	lang?: string;
	sort?: 'asc' | 'desc';
};
