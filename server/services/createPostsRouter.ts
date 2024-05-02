import { Service } from '../types';

import { getPost as getPostFn } from '../lib/posts';
import { GetPostRequest } from '../../common/api/GetPost';
import { Router } from 'express';
import { getPosts as getPostsFn } from '../lib/posts';
import { GetPostsRequest } from '../../common/api/GetPosts';
import { getPaginationInfo as getPaginationInfoFn } from '../lib/posts';
import { GetPaginationInfoRequest } from '../../common/api/GetPaginationInfo';
import { getPostUrls as getPostUrlsFn } from '../lib/posts';
import { getPostWithAdditionalData } from '../lib/posts';
import { GetPostWithAdditionalDataRequest } from '../../common/api/GetPostWithAdditionalData';

export const createPostsRouter: Service = () => {
	const router = Router();

	router.get('/getPost', async (req, res) => {
		const { url } = req.query as GetPostRequest;
		const post = await getPostFn(url);

		res.send(post);
	});

	router.get('/getPosts', async (req, res) => {
		const options = req.query as GetPostsRequest;
		const posts = await getPostsFn(options);

		res.send(posts);
	});

	router.get('/getPaginationInfo', async (req, res) => {
		const options = req.query as unknown as GetPaginationInfoRequest;
		const paginationInfo = await getPaginationInfoFn(options);

		res.send(paginationInfo);
	});

	router.get('/getPostUrls', async (_, res) => {
		const urls = await getPostUrlsFn();

		res.send(urls);
	});

	router.get('/getPostWithAdditionalData', async (req, res) => {
		const { url } = req.query as GetPostWithAdditionalDataRequest;
		const post = await getPostWithAdditionalData(url);

		res.send(post);
	});

	return router;
};
