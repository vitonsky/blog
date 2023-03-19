import { SitemapStream, streamToPromise } from 'sitemap';

import { writeFile } from 'fs/promises';

import { getPosts } from '../api/requests/getPosts';

import { siteInfo } from './constants';
import { getFullUrl } from './utils';

export const generateSitemap = async () => {
	const posts = await getPosts();

	if (posts.length === 0) return;

	const sitemap = new SitemapStream({ hostname: siteInfo.url });
	posts.forEach((post) => {
		const date = new Date(post.date);
		sitemap.write({ url: getFullUrl(post.url), lastmod: date.toUTCString() });
	});
	sitemap.end();

	const sitemapBuffer = await streamToPromise(sitemap);
	await writeFile('./public/sitemap.xml', sitemapBuffer);
};
