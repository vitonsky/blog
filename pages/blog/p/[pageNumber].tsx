import type {
	GetStaticPropsContext,
	GetStaticPropsResult,
	NextPage,
} from "next";

import { getPaginationInfo, getPosts } from "../../../lib/posts";
import { siteInfo } from "../../../lib/constants";

import { BlogPage, BlogPageProps } from "../../../components/BlogPage/BlogPage";

type PostsPageProps = Required<BlogPageProps>;

// TODO: set 15
const postsOnPage = 3;

const PostsPage: NextPage<PostsPageProps> = (props) => {
	return <BlogPage {...props} />;
};

export async function getStaticProps({
	params: { pageNumber: id } = {},
}: GetStaticPropsContext): Promise<GetStaticPropsResult<PostsPageProps>> {
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
		paths.push([siteInfo.blogPath, "p", pageNumber].join("/"));
	}

	return { paths, fallback: false };
};

export default PostsPage;
