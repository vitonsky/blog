import { ApiKnob } from '../types';

import { getPosts as getPostsFn } from '../lib/posts';
import { GetPostsRequest } from '../../common/api/GetPosts';

export const getPostsFabric: ApiKnob = (app) => {
	app.get('/getPosts', async function(req, res) {
		const options = req.query as GetPostsRequest;

		const posts = await getPostsFn(options);

		res.send(posts);
	});
};
