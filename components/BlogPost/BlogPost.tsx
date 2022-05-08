import { useEffect } from "react";
import { NextPage } from "next";
import { MDXRemote } from "next-mdx-remote";

import { Post } from "../../lib/posts";

import styles from './BlogPost.module.css';

export type BlogPostProps = {
	post: Post;
};

export const BlogPost: NextPage<BlogPostProps> = ({ post }) => {
	// TODO: remove
	useEffect(() => {
		console.log({ post });
	}, [post]);

	return (
		<div className={styles.BlogPost}>
			<div className={styles.PostHead}>
				<h1 className={styles.PostTitle}>{post.title}</h1>

				<div className={styles.PostInfo}>
					<span>{new Date(post.date).toDateString()}</span>
					<span>{Math.ceil(post.readingTime.minutes)} minutes to read</span>
				</div>
			</div>

			<div className={styles.PostBody}>
				<MDXRemote {...post.source} />
			</div>
		</div>
	);
};