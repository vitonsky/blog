import { ApiKnob } from '../types';
import { getPostUrls as getPostUrlsFn } from '../lib/posts';

export const getPostUrlsFabric: ApiKnob = (app) => {
	app.get('/getPostUrls', async function(_, res) {
		const urls = await getPostUrlsFn();

		res.send(urls);
	});
};
