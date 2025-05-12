import type { APIContext } from 'astro';
import rss from '@astrojs/rss';

import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getBlogPosts } from '../utils/getPosts';
import { getBlogPostLink } from '../utils/links';

export async function GET(context: APIContext) {
	const posts = await getBlogPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site as URL,
		items: posts.map((post) => ({
			...post.data,
			link: getBlogPostLink(post.id),
			categories: post.data.tags,
			pubDate: post.data.date,
			enclosure: post.data.image
				? {
						type: 'image',
						url: post.data.image.src,
						length: 0,
					}
				: undefined,
			...(post.previewText ? { description: post.previewText } : {}),
		})),
	});
}
