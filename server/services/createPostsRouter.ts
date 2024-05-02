import { Service } from '../types';

import { getPost } from '../lib/posts';
import { GetPostRequest } from '../../common/api/GetPost';
import { Router } from 'express';
import { getPosts } from '../lib/posts';
import { GetPostsRequest } from '../../common/api/GetPosts';
import { getPaginationInfo } from '../lib/posts';
import { GetPaginationInfoRequest } from '../../common/api/GetPaginationInfo';
import { getPostUrls } from '../lib/posts';
import { getPostWithAdditionalData } from '../lib/posts';
import { GetPostWithAdditionalDataRequest } from '../../common/api/GetPostWithAdditionalData';

export const createPostsRouter: Service = () => {
	const router = Router();

	router.get('/getPost', async (req, res) => {
		const { url } = req.query as GetPostRequest;
		const post = await getPost(url);

		res.send(post);
	});

	router.get('/getPosts', async (req, res) => {
		const options = req.query as GetPostsRequest;
		const posts = await getPosts(options);

		res.send(posts);
	});

	router.get('/getPaginationInfo', async (req, res) => {
		const options = req.query as unknown as GetPaginationInfoRequest;
		const paginationInfo = await getPaginationInfo(options);

		res.send(paginationInfo);
	});

	router.get('/getPostUrls', async (_, res) => {
		const urls = await getPostUrls();

		res.send(urls);
	});

	router.get('/getPostWithAdditionalData', async (req, res) => {
		const { url } = req.query as GetPostWithAdditionalDataRequest;
		const post = await getPostWithAdditionalData(url);

		res.send(post);
	});

	return router;
};
