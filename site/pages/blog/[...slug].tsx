import { NextPage, GetStaticPropsContext, GetStaticPropsResult } from 'next';

import { Post } from '../../../common/Post';
import { siteInfo } from '../../lib/constants';

import { BlogPost } from '../../components/BlogPost/BlogPost';
import { getPost } from '../../api/requests/getPost';
import { getPostUrls } from '../../api/requests/getPostUrls';

type PostProps = {
	post: Post;
};

const Post: NextPage<PostProps> = ({ post }) => {
	return <BlogPost post={post} />;
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
	return { props: { post } };
}

export const getStaticPaths = async () => {
	const paths = await getPostUrls();
	return { paths, fallback: false };
};

export default Post;
