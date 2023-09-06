import { NextPage, GetStaticPropsContext, GetStaticPropsResult } from 'next';

import { Post } from '../../../common/Post';
import { siteInfo } from '../../lib/constants';

import { BlogPost } from '../../components/BlogPost/BlogPost';
import { getPost } from '../../api/requests/getPost';
import { getPostUrls } from '../../api/requests/getPostUrls';
import { getPosts } from '../../api/requests/getPosts';

type PostProps = {
	post: Post;
	relatedPosts?: Pick<Post, 'url' | 'title'>[];
};

const Post: NextPage<PostProps> = ({ post, relatedPosts }) => {
	return <BlogPost post={post} relatedPosts={relatedPosts} />;
};

export async function getStaticProps({
	params: { slug } = {},
}: GetStaticPropsContext): Promise<GetStaticPropsResult<PostProps>> {
	if (slug === undefined) {
		throw new Error('Empty slug');
	}

	const pagePath = Array.isArray(slug) ? slug.join('/') : slug;
	const url = [siteInfo.blogPath, pagePath].join('/');

	const post = await getPost({ url });

	const posts = await getPosts();

	const getRandomSortMove = () => Math.random() > 0.5 ? 1 : -1;
	const relatedPosts = posts
		.filter(({ url, tags }) => url !== post.url && tags.length > 0)
		.sort(getRandomSortMove)
		.sort((a, b) => {
			const aMatchedTags = a.tags.filter((tag) => post.tags.includes(tag)).length;
			const bMatchedTags = b.tags.filter((tag) => post.tags.includes(tag)).length;

			if (aMatchedTags === bMatchedTags) return getRandomSortMove();
			return aMatchedTags > bMatchedTags ? -1 : 1;
		})
		.slice(0, 5)
		// Pick only few props to minimize stringified data in post
		.map(({ title, url }) => ({ title, url }));

	return { props: { post, relatedPosts } };
}

export const getStaticPaths = async () => {
	const paths = await getPostUrls();
	return { paths, fallback: false };
};

export default Post;
