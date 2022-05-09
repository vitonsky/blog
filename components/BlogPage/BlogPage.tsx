import { useEffect } from "react";
import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";

import { Post } from "../../lib/posts";
import { blogUrlPath, metaData } from "../../lib/constants";
import { getDateFromTimestamp } from "../../lib/utils";

import { Pagination } from "../Pagination/Pagination";

import styles from "./BlogPage.module.css";

export type BlogPageProps = {
	posts: Post[];
	pagination?: {
		page: number;
		pagesNumber: number;
	};
};

export const BlogPage: NextPage<BlogPageProps> = ({ posts, pagination }) => {
	// TODO: remove
	useEffect(() => {
		console.log({ posts });
	}, [posts]);

	return (
		<>
			<Head>
				{metaData.map((props, idx) => (
					<meta {...props} key={idx} />
				))}
			</Head>

			<div className={styles.BlogPage}>
				<div className={styles.PostsList}>
					{posts.map((post, idx) => (
						<div key={idx} className={styles.PostItem}>
							<div className={styles.PostHead}>
								<h3 className={styles.PostTitle}>
									<Link href={post.url}>{post.title}</Link>
								</h3>

								<div className={styles.PostInfo}>
									<span>{getDateFromTimestamp(post.date)}</span>
									<span>{post.readingTime.words} words</span>
									<span>
										{Math.ceil(post.readingTime.minutes)} minutes to read
									</span>
								</div>
							</div>

							<div className={styles.PostText}>{post.previewText}</div>

							{post.image && (
								<div>
									<img src={post.image} alt="Cover of the post" />
								</div>
							)}

							<div className={styles.PostText}>
								<Link href={post.url}>Continue...</Link>
							</div>
						</div>
					))}
				</div>

				{pagination && pagination.pagesNumber > 1 && (
					<Pagination
						currentPage={pagination.page}
						pagesNumber={pagination.pagesNumber}
						prefix={blogUrlPath + "/p/"}
					/>
				)}
			</div>
		</>
	);
};
