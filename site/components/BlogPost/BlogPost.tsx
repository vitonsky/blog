import { HTMLAttributes } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';
import { NextSeo } from 'next-seo';

import { Post } from '../../../common/Post';
import { siteInfo } from '../../lib/constants';
import { getDateFromTimestamp, getFullUrl } from '../../lib/utils';
import { socialMedia } from '../../links';

import { Link } from '../Link/Link';
import { List } from '../List/List';
import { ListItem } from '../List/ListItem';
import { ShareBlock } from '../ShareBlock/ShareBlock';

import styles from './BlogPost.module.css';

const internalLinkPrefixes = ['/blog'];
const mdxComponents: Required<Parameters<typeof MDXRemote>[0]>['components'] = {
	a: (props: HTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
		const isInternalLink =
			props.href !== undefined &&
			internalLinkPrefixes.some((prefix) => props.href!.startsWith(prefix));

		return (
			<Link
				external={!isInternalLink}
				target={isInternalLink ? undefined : '__blank'}
				{...props}
			/>
		);
	},
	ul: List,
	li: ListItem,
};

export type BlogPostProps = {
	post: Post;
	relatedPosts?: Pick<Post, 'url' | 'title'>[];
};

export const BlogPost: NextPage<BlogPostProps> = ({ post, relatedPosts }) => {
	const keywords = [...(post.keywords ?? []), ...(post.tags ?? [])].filter(
		(keyword, idx, arr) => arr.indexOf(keyword) === idx,
	);

	return (
		<>
			<NextSeo
				title={post.title}
				description={post.description || post.previewText}
				openGraph={{
					siteName: siteInfo.title,
					type: 'article',
					locale:
						post.lang === null || post.lang === 'en' ? 'en_US' : post.lang,
					images:
						post.coverImage !== null
							? [{ url: getFullUrl(post.coverImage) }]
							: [],
					article: {
						section: 'Technology',
						authors: [siteInfo.author],
						tags: post.tags,
						publishedTime: new Date(post.date).toUTCString(),
					},
				}}
				twitter={{
					cardType: 'summary_large_image',
					handle: '@rvitonsky',
					site: '@rvitonsky',
				}}
			/>
			<Head>
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
				{keywords.length > 0 && (
					<meta name="keywords" content={keywords.join(', ')} />
				)}
				<meta
					name="twitter:url"
					property="og:url"
					content={getFullUrl(post.url)}
				/>
			</Head>

			<div className={styles.BlogPost}>
				<div className={styles.PostHead}>
					<h1 className={styles.PostTitle}>{post.title}</h1>

					<div className={styles.PostInfo}>
						<span className={styles.PostDate}>
							{getDateFromTimestamp(post.date)}
						</span>
						<span>{Math.ceil(post.readingTime.minutes)} minutes to read</span>
					</div>
				</div>

				<div className={styles.ShareBlock}>
					<ShareBlock url={post.url} title={post.title} />
				</div>

				<div className={styles.PostBody}>
					<MDXRemote {...post.source} components={mdxComponents} />
				</div>
			</div>

			{relatedPosts && (
				<>
					<div className={styles.Divider}></div>
					<div className={styles.RelatedPosts}>
						<h1 className={styles.RelatedPostsTitle}>Related posts</h1>

						<ul className={styles.RelatedPostsList}>
							{relatedPosts.map((post) => (
								<li
									key={post.url}
									className={styles.RelatedPostsListItem}
								>
									<Link href={post.url} className={styles.RelatedPost}>
										{post.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</>
			)}

			<div className={styles.FollowMeContainer}>
				Let's network. I'm in{' '}
				<Link href={socialMedia.mastodon} target="_blank">
					Mastodon
				</Link>{' '}
				and{' '}
				<Link href={socialMedia.twitter} target="_blank">
					Twitter
				</Link>
			</div>
		</>
	);
};
