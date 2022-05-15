const path = require('path');

module.exports = {
	entry: './server/index',
	devtool: 'inline-source-map',
	mode: 'development',
	target: 'node',
	// cache: {
	// 	type: 'filesystem',
	// 	allowCollectingMemory: true,
	// },
	output: {
		path: path.join(__dirname, 'server/dist'),
		filename: 'server.js',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'esbuild-loader',
				exclude: /node_modules/,
				options: {
					loader: 'ts',
					target: 'es2015',
				},
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
	},
};
