import { NextPage } from 'next';
import Head from 'next/head';

import { Post } from '../../../common/Post';
import { metaData, siteInfo } from '../../lib/constants';
import { getDateFromTimestamp } from '../../lib/utils';

import { Link } from '../Link/Link';
import { Pagination } from '../Pagination/Pagination';

import styles from './BlogPage.module.css';

export type BlogPageProps = {
	posts: Post[];
	pagination?: {
		page: number;
		pagesNumber: number;
	};
};

// TODO: add link to fix typo
export const BlogPage: NextPage<BlogPageProps> = ({ posts, pagination }) => {
	return (
		<>
			<Head>
				{metaData.map((props, idx) => (
					<meta {...props} key={idx} />
				))}
			</Head>

			<div className={styles.BlogPage}>
				<div className={styles.PostsList}>
					{posts.length === 0 && (
						<div className={styles.EmptyPosts}>Posts did not added yet</div>
					)}
					{posts.map((post, idx) => (
						<div key={idx} className={styles.PostItem}>
							<div className={styles.PostHead}>
								<h3 className={styles.PostTitle}>
									<Link href={post.url}>{post.title}</Link>
								</h3>

								<div className={styles.PostInfo}>
									<span className={styles.PostDate}>
										{getDateFromTimestamp(post.date)}
									</span>
									<span>{post.readingTime.words} words</span>
									<span>
										{Math.ceil(post.readingTime.minutes)} minutes to
										read
									</span>
								</div>
							</div>

							<div className={styles.PostText}>{post.previewText}</div>

							{post.previewImage && (
								<div>
									<img
										src={post.previewImage}
										alt="Cover of the post"
									/>
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
						prefix={siteInfo.blogPath + '/p/'}
					/>
				)}
			</div>
		</>
	);
};
