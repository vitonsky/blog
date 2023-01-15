import { ApiKnob } from '../types';

import { getPostWithAdditionalData as getPostFn } from '../lib/posts';
import { GetPostWithAdditionalDataRequest } from '../../common/api/GetPostWithAdditionalData';

export const getPostWithAdditionalDataFabric: ApiKnob = (app) => {
	app.get('/getPostWithAdditionalData', async function(req, res) {
		const { url } = req.query as GetPostWithAdditionalDataRequest;

		const post = await getPostFn(url);

		res.send(post);
	});
};
