import { Router } from 'express';
import path from 'path';

import { GetPaginationInfoRequest } from '../../common/api/GetPaginationInfo';
import { GetPostRequest } from '../../common/api/GetPost';
import { GetPostsRequest } from '../../common/api/GetPosts';
import { GetPostWithAdditionalDataRequest } from '../../common/api/GetPostWithAdditionalData';

import { attachmentsPath, publicDir } from '../constants';
import { Posts } from '../lib/posts';
import { RawPosts } from '../lib/posts/RawPosts';
import { Service } from '../types';

export const createPostsRouter: Service = () => {
	const postsDb = new Posts(
		new RawPosts({ attachmentsDir: path.join(publicDir, attachmentsPath) }),
	);

	const router = Router();

	router.get('/getPost', async (req, res) => {
		const { url } = req.query as GetPostRequest;
		const post = await postsDb.getPost(url);

		res.json(post);
	});

	router.get('/getPosts', async (req, res) => {
		const options = req.query as GetPostsRequest;
		const posts = await postsDb.getPosts(options);

		res.json(posts);
	});

	router.get('/getPaginationInfo', async (req, res) => {
		const options = req.query as unknown as GetPaginationInfoRequest;
		const paginationInfo = await postsDb.getPaginationInfo(options);

		res.json(paginationInfo);
	});

	router.get('/getPostUrls', async (_, res) => {
		const urls = await postsDb.getPostUrls();

		res.json(urls);
	});

	router.get('/getPostWithAdditionalData', async (req, res) => {
		const { url } = req.query as GetPostWithAdditionalDataRequest;
		const post = await postsDb.getPostWithAdditionalData(url);

		res.json(post);
	});

	return router;
};
