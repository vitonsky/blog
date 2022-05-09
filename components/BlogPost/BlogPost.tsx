import { useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";

import { Post } from "../../lib/posts";
import { getDateFromTimestamp } from "../../lib/utils";
import { siteMeta, siteURL } from "../../lib/constants";

import { ShareBlock } from "../ShareBlock/ShareBlock";

import styles from "./BlogPost.module.css";

export type BlogPostProps = {
	post: Post;
};

export const BlogPost: NextPage<BlogPostProps> = ({ post }) => {
	// TODO: remove
	useEffect(() => {
		console.log({ post });
	}, [post]);

	const getFullUrl = (relativePath: string) => siteURL + relativePath;

	// TODO: use description instead `previewText` when it possible
	return (
		<>
			<Head>
				<title>{post.title}</title>
				<meta
					name="viewport"
					content="width=device-width,minimum-scale=1,initial-scale=1"
				/>
				<meta
					data-rh="true"
					name="robots"
					content="index,follow,max-image-preview:large"
				></meta>

				{/* Common metadata */}
				<meta name="description" content={post.previewText} />
				{post.keywords.length > 0 && (
					<meta name="keywords" content={post.keywords.join(", ")} />
				)}
				<meta name="author" content={siteMeta.author} />
				<meta
					name="article:published_time"
					content={new Date(post.date).toISOString()}
				/>

				{/* Open graph */}
				<meta name="og:site_name" content={siteMeta.title} />
				<meta name="og:type" content="article" />
				<meta
					name="og:locale"
					content={
						post.lang === null || post.lang === "en" ? "en_US" : post.lang
					}
				/>
				{post.image !== null && (
					<meta name="og:image" content={getFullUrl(post.image)} />
				)}

				{/* Social media */}
				<meta name="twitter:title" property="og:title" content={post.title} />
				<meta
					name="twitter:description"
					property="og:description"
					content={post.previewText}
				/>
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:url"
					property="og:url"
					content={getFullUrl(post.url)}
				/>
				{post.image !== null && (
					<meta name="twitter:image" content={getFullUrl(post.image)} />
				)}
			</Head>

			<div className={styles.BlogPost}>
				<div className={styles.PostHead}>
					<h1 className={styles.PostTitle}>{post.title}</h1>

					<div className={styles.PostInfo}>
						<span>{getDateFromTimestamp(post.date)}</span>
						<span>{Math.ceil(post.readingTime.minutes)} minutes to read</span>
					</div>
				</div>

				<div className={styles.ShareBlock}>
					<ShareBlock url={post.url} title={post.title} />
				</div>

				<div className={styles.PostBody}>
					<MDXRemote {...post.source} />
				</div>
			</div>
		</>
	);
};
