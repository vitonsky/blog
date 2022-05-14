import { ApiKnob } from "../types";
import { buildApiRequest } from "../lib/api";

import { getPaginationInfo as getPaginationInfoFn } from "../lib/posts";

export type Params = {
	itemsOnPage: number;
	tag?: string;
	lang?: string;
};

export const getPaginationInfo = buildApiRequest<Params, {
	postsNumber: number;
	pagesNumber: number;
}>('/getPaginationInfo');

export const getPaginationInfoFabric: ApiKnob = (app) => {
	app.get('/getPaginationInfo', async function (req, res) {
		const options = req.query as unknown as Params;

		const paginationInfo = await getPaginationInfoFn(options);

		res.send(paginationInfo);
	});
}