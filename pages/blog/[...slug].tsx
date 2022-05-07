import { useEffect } from "react";
import { NextPage, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { MDXRemote } from "next-mdx-remote";

import path from "path";

import { getPost, getPostFilenameByUrl, getPosts, Post } from "../../lib/posts";
import { blogPostsDir, blogUrlPath } from "../../lib/constants";

type BlogPostProps = {
	post: Post;
};

const BlogPost: NextPage<BlogPostProps> = ({ post }) => {
	useEffect(() => {
		console.log("post data", post);
	}, [post]);

	// TODO: implement layout
	return (
		<div>
			{JSON.stringify(post.source.frontmatter)}
			<hr />

			<MDXRemote {...post.source} />
		</div>
	);
};

export async function getStaticProps({
	params: { slug } = {},
}: GetStaticPropsContext): Promise<GetStaticPropsResult<BlogPostProps>> {
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

export default BlogPost;
