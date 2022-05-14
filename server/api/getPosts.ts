import { ApiKnob } from "../types";
import { buildApiRequest } from "../lib/api";

import { getPosts as getPostsFn, Post } from "../lib/posts";

export type Params = {
	from?: number;
	limit?: number;
	tag?: string;
	lang?: string;
	sort?: "asc" | "desc";
};

export const getPosts = buildApiRequest<Params, Post[]>('/getPosts');

export const getPostsFabric: ApiKnob = (app) => {
	app.get("/getPosts", async function (req, res) {
		const options = req.query as Params;

		const posts = await getPostsFn(options);

		res.send(posts);
	});
};
