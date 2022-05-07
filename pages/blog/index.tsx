import { useEffect } from "react";
import type {
	GetStaticPropsResult,
	NextPage,
} from "next";

import { getPosts, Post } from "../../lib/posts";

type BlogPageProps = {
	posts: Post[];
};

// TODO: implement pagination
const BlogPage: NextPage<BlogPageProps> = ({ posts }) => {
	useEffect(() => {
		console.log({ posts });
	}, [posts]);

	// TODO: add layout
	return <div>
		<h1>Blog posts</h1>
		{posts.map((post, idx) => (<div key={idx}>
			<h3><a href={post.url}>{post.title}</a></h3>

			<p>{post.previewText}</p>

			<div>{new Date(post.date).toDateString()}</div>
		</div>))}
	</div>;
};

export async function getStaticProps(): Promise<GetStaticPropsResult<BlogPageProps>> {
	const posts = await getPosts();
	return { props: { posts } };
}

export default BlogPage;
