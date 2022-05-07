import { useEffect } from "react";
import type {
	GetStaticPropsResult,
	NextPage,
} from "next";

import { readFile, stat } from "fs/promises";

import { blogPostsDir } from "../../lib/constants";
import { getAllPostsInDir, getPostUrlByFilename, parsePost } from "../../lib/posts";

type Post = {
	url: string;
	title: string;
	date: number;
	previewText: string;
	image: string | null;
};

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
	const files = await getAllPostsInDir(blogPostsDir);

	const posts: Post[] = await Promise.all(
		files.map(async (filename) => {
			const url = getPostUrlByFilename(filename);
			const mdFile = await readFile(filename);
			const postSource = mdFile.toString();
			const { previewText, title, image } = await parsePost(postSource);

			const { birthtime } = await stat(filename);

			return {
				url,
				title,
				date: birthtime.getTime(),
				previewText,
				image,
			};
		})
	).then((posts) => posts.sort((p1, p2) => p2.date - p1.date));

	return { props: { posts } };
}

export default BlogPage;
