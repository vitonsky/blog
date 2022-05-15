import { ApiKnob } from "../types";
import { buildApiRequest } from "../lib/api";

import { getPostWithAdditionalData as getPostFn, PostWithAdditionalData } from "../lib/posts";

export type Params = { url: string };

export const getPostWithAdditionalData = buildApiRequest<Params, PostWithAdditionalData>('/getPostWithAdditionalData');

export const getPostWithAdditionalDataFabric: ApiKnob = (app) => {
	app.get('/getPostWithAdditionalData', async function (req, res) {
		const { url } = req.query as Params;

		const post = await getPostFn(url);

		res.send(post);
	});
}