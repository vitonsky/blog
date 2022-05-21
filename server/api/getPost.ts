import { ApiKnob } from '../types';
import { buildApiRequest } from '../lib/api';

import { getPost as getPostFn, Post } from '../lib/posts';

export type Params = { url: string };

export const getPost = buildApiRequest<Params, Post>('/getPost');

export const getPostFabric: ApiKnob = (app) => {
	app.get('/getPost', async function(req, res) {
		const { url } = req.query as Params;

		const post = await getPostFn(url);

		res.send(post);
	});
};
