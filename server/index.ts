import express from 'express';
import minimist from 'minimist';
import 'express-async-errors';

import { apiPath, port } from './constants';

import { createPostsRouter } from './services/createPostsRouter';
import { errorHandlerMiddleware } from './middleware/handleErrors';

export const runServer = () => {
	console.log('Run API server: ' + apiPath);

	const app = express();
	app.use(express.json());

	app.get('/', function(_, res) {
		res.send('This is API server to handle files for blog');
	});

	// Up services
	[createPostsRouter].forEach((fabric) => {
		const router = fabric(app);
		app.use(router);
	});

	// Up server
	app.use(errorHandlerMiddleware);
	const server = app.listen(port);

	// Graceful shutdown
	const closeApp = function() {
		server.close(function() {
			process.exit(0);
		});
	};
	process.on('SIGTERM', closeApp);
	process.on('beforeExit', closeApp);
};

// Run server
const argv = minimist(process.argv.slice(2));
if (argv._[0] === 'start') {
	runServer();
}
