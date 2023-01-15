import { ApiKnob } from '../types';

import { getPaginationInfo as getPaginationInfoFn } from '../lib/posts';
import { GetPaginationInfoRequest } from '../../common/api/GetPaginationInfo';

export const getPaginationInfoFabric: ApiKnob = (app) => {
	app.get('/getPaginationInfo', async function(req, res) {
		const options = req.query as unknown as GetPaginationInfoRequest;

		const paginationInfo = await getPaginationInfoFn(options);

		res.send(paginationInfo);
	});
};
