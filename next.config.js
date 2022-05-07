const { patchWebpackConfig } = require('next-global-css');

// NOTE: This is not used at this time
const withMDX = require('@next/mdx')({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
});

module.exports = withMDX({
	// enable to `index` pages will work with catch-all routes
	trailingSlash: true,

	reactStrictMode: true,
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	webpack: (config, options) => {
		patchWebpackConfig(config, options);
		return config;
	},
})
