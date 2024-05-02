import { Service } from '../types';

import { Posts } from '../lib/posts';
import { GetPostRequest } from '../../common/api/GetPost';
import { Router } from 'express';
import { GetPostsRequest } from '../../common/api/GetPosts';
import { GetPaginationInfoRequest } from '../../common/api/GetPaginationInfo';
import { GetPostWithAdditionalDataRequest } from '../../common/api/GetPostWithAdditionalData';
import { attachmentsPath, publicDir } from '../constants';
import { RawPosts } from '../lib/posts/RawPosts';
import path from 'path';

export const createPostsRouter: Service = () => {
	const postsDb = new Posts(
		new RawPosts({ attachmentsDir: path.join(publicDir, attachmentsPath) }),
	);

	const router = Router();

	router.get('/getPost', async (req, res) => {
		const { url } = req.query as GetPostRequest;
		const post = await postsDb.getPost(url);

		res.send(post);
	});

	router.get('/getPosts', async (req, res) => {
		const options = req.query as GetPostsRequest;
		const posts = await postsDb.getPosts(options);

		res.send(posts);
	});

	router.get('/getPaginationInfo', async (req, res) => {
		const options = req.query as unknown as GetPaginationInfoRequest;
		const paginationInfo = await postsDb.getPaginationInfo(options);

		res.send(paginationInfo);
	});

	router.get('/getPostUrls', async (_, res) => {
		const urls = await postsDb.getPostUrls();

		res.send(urls);
	});

	router.get('/getPostWithAdditionalData', async (req, res) => {
		const { url } = req.query as GetPostWithAdditionalDataRequest;
		const post = await postsDb.getPostWithAdditionalData(url);

		res.send(post);
	});

	return router;
};
