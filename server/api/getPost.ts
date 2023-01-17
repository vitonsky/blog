import { ApiKnob } from '../types';

import { getPost as getPostFn } from '../lib/posts';
import { GetPostRequest } from '../../common/api/GetPost';

export const getPostFabric: ApiKnob = (app) => {
	app.get('/getPost', async function(req, res) {
		const { url } = req.query as GetPostRequest;

		const post = await getPostFn(url);

		res.send(post);
	});
};
