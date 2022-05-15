import express from 'express';
import minimist from 'minimist';

import { apiPath, port } from './constants';

import { initCache } from './lib/posts/cache';

import { getPostUrlsFabric } from './api/getPostUrls';
import { getPostsFabric } from './api/getPosts';
import { getPostFabric } from './api/getPost';
import { getPaginationInfoFabric } from './api/getPaginationInfo';

export const runServer = () => {
	console.log('Run API server: ' + apiPath);

	initCache();

	const app = express()
	app.listen(port);

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
}

// Run server
const argv = minimist(process.argv.slice(2));
if (argv._[0] === 'start') {
	runServer();
}