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
	reactStrictMode: true,
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	webpack: (config, options) => {
		patchWebpackConfig(config, options);
		return config;
	},
})
