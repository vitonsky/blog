import { ApiKnob } from "../types";
import { buildApiRequest } from "../lib/api";

import { getPost as getPostFn, getPostFilenameByUrl, Post } from "../lib/posts";

export type Params = { url: string };

export const getPost = buildApiRequest<Params, Post>('/getPost');

export const getPostFabric: ApiKnob = (app) => {
	app.get('/getPost', async function (req, res) {
		const { url } = req.query as Params;

		const path = getPostFilenameByUrl(url as string);
		const post = await getPostFn(path);

		res.send(post);
	});
}