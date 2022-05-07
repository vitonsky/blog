import { useEffect } from "react";
import { NextPage, GetStaticPropsContext, GetStaticPropsResult } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { visit } from "unist-util-visit";

import path from "path";
import { readFile } from "fs/promises";

import { getAllPostsInDir, getPostUrlByFilename } from "../../lib/posts";
import { blogPostsDir, contentDir } from "../../lib/constants";

type BlogPostProps = {
	source: MDXRemoteSerializeResult<Record<string, unknown>>;
	previewText: string | null;
};

const BlogPost: NextPage<BlogPostProps> = ({ source, ...args }) => {
	useEffect(() => {
		console.log("args", { source, args });
	}, [args, source]);

	// TODO: implement layout
	return (
		<div>
			{JSON.stringify(source.frontmatter)}
			<hr />

			<MDXRemote {...source} />
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
	const mdFilePath = path.join(blogPostsDir, pagePath + ".md");

	const mdFile = await readFile(mdFilePath);
	const postSource = mdFile.toString();

	// Find preview text
	let previewText: string | null = null;
	const mdxSource = await serialize(postSource, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [
				() => (node) => {
					visit(node, "paragraph", (paragraph) => {
						if (previewText !== null) return;

						let texts: string[] = [];
						visit(paragraph, "text", (node) => {
							texts.push(node.value);
						});

						if (texts.length > 0) {
							previewText = texts.join("\n\n");
						}
					});
				},
			],
		},
	});

	return { props: { source: mdxSource, previewText } };
}

export const getStaticPaths = async () => {
	const files = await getAllPostsInDir(blogPostsDir);
	const paths = files.map(getPostUrlByFilename);

	console.log("Blog pages", paths);
	return { paths, fallback: false };
};

export default BlogPost;
