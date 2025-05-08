import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getBlogPostLink } from '../utils/links';
import type { APIContext } from "astro";
import { getBlogPosts } from '../utils/getPosts';

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
			enclosure: post.data.image ? {
				type: 'image',
				url: post.data.image.src,
				length: 0,
			} : undefined,
			...(post.previewText ? { description: post.previewText } : {}),
		})),
	});
}
