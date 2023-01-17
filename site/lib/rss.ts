import { Feed } from 'feed';

import { writeFile } from 'fs/promises';

import { getPosts } from '../api/requests/getPosts';
import { getPostWithAdditionalData } from '../api/requests/getPostWithAdditionalData';

import { siteInfo } from './constants';
import { getFullUrl } from './utils';

// TODO: update links and titles
export const generateRss = async () => {
	const posts = await getPosts({ limit: 15 }).then((posts) =>
		Promise.all(posts.map((post) => getPostWithAdditionalData({ url: post.url }))),
	);

	if (posts.length === 0) return;

	const feed = new Feed({
		language: 'en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
		title: siteInfo.title,
		description: siteInfo.description,
		id: siteInfo.url,
		copyright: `All rights reserved ${new Date().getFullYear()}, ${siteInfo.author}`,
		updated: new Date(posts[0].date), // date of last post
		link: siteInfo.url,
		// image: "http://example.com/image.png",
		favicon: `${siteInfo.url}/favicon.ico`,
		author: {
			name: siteInfo.author,
			// email: "johndoe@example.com",
			// link: "https://example.com/johndoe"
		},
		// generator: "awesome", // optional, default = 'Feed for Node.js'
	});

	posts.forEach((post) => {
		feed.addItem({
			id: getFullUrl(post.url),
			link: getFullUrl(post.url),

			title: post.title,
			description: post.description || post.previewText,
			image: post.coverImage === null ? undefined : getFullUrl(post.coverImage),
			content: post.additionalData.html,

			date: new Date(post.date),
			category: post.tags.map((tag) => ({ name: tag })),

			// author: [
			// 	{
			// 		name: "Jane Doe",
			// 		email: "janedoe@example.com",
			// 		link: "https://example.com/janedoe"
			// 	},
			// 	{
			// 		name: "Joe Smith",
			// 		email: "joesmith@example.com",
			// 		link: "https://example.com/joesmith"
			// 	}
			// ],
		});
	});

	// feed.addContributor({
	// 	name: "Johan Cruyff",
	// 	email: "johancruyff@example.com",
	// 	link: "https://example.com/johancruyff"
	// });

	await writeFile('./public/rss.xml', feed.rss2());
};
