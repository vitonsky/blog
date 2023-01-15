export type GetPaginationInfoRequest = {
	itemsOnPage: number;
	tag?: string;
	lang?: string;
};

export type GetPaginationInfoResponse = {
	postsNumber: number;
	pagesNumber: number;
};
