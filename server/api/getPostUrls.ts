import { ApiKnob } from "../types";
import { buildApiRequest } from "../lib/api";
import { getPostUrls as getPostUrlsFn } from "../lib/posts";

export const getPostUrls = buildApiRequest<void, string[]>('/getPostUrls');

export const getPostUrlsFabric: ApiKnob = (app) => {
	app.get('/getPostUrls', async function (_, res) {
		const urls = await getPostUrlsFn();

		res.send(urls);
	});
}