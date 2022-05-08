import { NextPage, GetStaticPropsContext, GetStaticPropsResult } from "next";

import { getPost, getPostFilenameByUrl, getPosts, Post } from "../../lib/posts";
import { blogUrlPath } from "../../lib/constants";

import { BlogPost } from "../../components/BlogPost/BlogPost";

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
		throw new Error("Empty slug");
	}

	const pagePath = Array.isArray(slug) ? slug.join("/") : slug;
	const mdFilePath = getPostFilenameByUrl([blogUrlPath, pagePath].join('/'));
	const post = await getPost(mdFilePath);
	return { props: { post } };
}

export const getStaticPaths = async () => {
	const posts = await getPosts();
	const paths = posts.map((post) => post.url);

	console.log("Blog pages", paths);
	return { paths, fallback: false };
};

export default Post;
