import express from 'express';

import { port } from './constants';

import { getPostUrlsFabric } from './api/getPostUrls';
import { getPostsFabric } from './api/getPosts';
import { getPostFabric } from './api/getPost';
import { getPaginationInfoFabric } from './api/getPaginationInfo';

// TODO: set up a light API server to return posts
// it should have watcher of files and cache to avoid useless calculations
const app = express()
const server = app.listen(port);

app.get('/', function (_, res) {
	res.send('This is API server to handle files for blog');
});

// Apply API knobs
[
	getPostUrlsFabric,
	getPostsFabric,
	getPostFabric,
	getPaginationInfoFabric
].forEach((fabric) => {
	fabric(app);
})

export default server;