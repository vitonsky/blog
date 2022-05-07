import { useEffect } from "react";
import type {
	GetStaticPropsContext,
	GetStaticPropsResult,
	NextPage,
} from "next";

import { getPaginationInfo, getPosts, Post } from "../../../lib/posts";
import { blogUrlPath } from "../../../lib/constants";
import { Pagination } from "../../../components/Pagination/Pagination";

type BlogPageProps = {
	posts: Post[];
	pagination: {
		page: number;
		pagesNumber: number;
	};
};

const postsOnPage = 2;

// TODO: implement pagination
const BlogPage: NextPage<BlogPageProps> = ({ posts, pagination }) => {
	useEffect(() => {
		console.log({ posts });
	}, [posts]);

	// TODO: add layout
	return (
		<div>
			<h1>Blog posts</h1>
			{posts.map((post, idx) => (
				<div key={idx}>
					<h3>
						<a href={post.url}>{post.title}</a>
					</h3>

					<p>{post.previewText}</p>

					<div>{new Date(post.date).toDateString()}</div>
				</div>
			))}

			<Pagination
				currentPage={pagination.page}
				pagesNumber={pagination.pagesNumber}
				prefix="/blog/p/"
			/>
		</div>
	);
};

export async function getStaticProps({
	params: { id } = {},
}: GetStaticPropsContext): Promise<GetStaticPropsResult<BlogPageProps>> {
	const pageNumber = typeof id === "string" ? +id : 1;

	const offset = postsOnPage * (pageNumber - 1);
	const posts = await getPosts({ limit: postsOnPage, from: offset });

	const { pagesNumber } = await getPaginationInfo({ itemsOnPage: postsOnPage });
	return { props: { posts, pagination: { page: pageNumber, pagesNumber } } };
}

export const getStaticPaths = async () => {
	const { pagesNumber } = await getPaginationInfo({ itemsOnPage: postsOnPage });

	const paths: string[] = [];
	for (let pageNumber = 1; pageNumber <= pagesNumber; pageNumber++) {
		paths.push([blogUrlPath, "p", pageNumber].join("/"));
	}

	return { paths, fallback: false };
};

export default BlogPage;
