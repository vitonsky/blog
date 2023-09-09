import { NextPage } from 'next';
import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';

import { Post } from '../../../common/Post';
import { siteInfo } from '../../lib/constants';
import { getDateFromTimestamp, getFullUrl } from '../../lib/utils';

import { Link } from '../Link/Link';

import { ShareBlock } from '../ShareBlock/ShareBlock';
import { List } from '../List/List';
import { ListItem } from '../List/ListItem';

import styles from './BlogPost.module.css';

const internalLinkPrefixes = ['/blog'];
const mdxComponents: Required<Parameters<typeof MDXRemote>[0]>['components'] = {
	a: (props) => {
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
				<meta name="description" content={post.description || post.previewText} />
				{keywords.length > 0 && (
					<meta name="keywords" content={keywords.join(', ')} />
				)}
				<meta name="author" content={siteInfo.author} />
				<meta
					name="article:published_time"
					content={new Date(post.date).toUTCString()}
				/>

				{/* Open graph */}
				<meta name="og:site_name" content={siteInfo.title} />
				<meta name="og:type" content="article" />
				<meta
					name="og:locale"
					content={
						post.lang === null || post.lang === 'en' ? 'en_US' : post.lang
					}
				/>
				{post.coverImage !== null && (
					<meta name="og:image" content={getFullUrl(post.coverImage)} />
				)}

				{/* Social media */}
				<meta name="twitter:title" property="og:title" content={post.title} />
				<meta
					name="twitter:description"
					property="og:description"
					content={post.description || post.previewText}
				/>
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:url"
					property="og:url"
					content={getFullUrl(post.url)}
				/>
				{post.coverImage !== null && (
					<meta name="twitter:image" content={getFullUrl(post.coverImage)} />
				)}
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

			{relatedPosts && <div className={styles.RelatedPosts}>
				<h1 className={styles.RelatedPostsTitle}>Related posts</h1>

				<ul className={styles.RelatedPostsList}>
					{relatedPosts.map((post) => <li key={post.url} className={styles.RelatedPostsListItem}>
						<Link href={post.url} className={styles.RelatedPost}>{post.title}</Link>
					</li>)}
				</ul>

			</div>}

			<div className={styles.FollowMeContainer}>
				<a href='https://mastodon.social/@vitonsky'>Follow me on Mastodon</a> for discussions, stay tuned!
			</div>
		</>
	);
};
