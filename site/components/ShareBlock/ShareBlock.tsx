import { ComponentType, FC } from 'react';

import { getFullUrl } from '../../lib/utils';

import { Link } from '../Link/Link';
import facebook from './icons/facebook.svg';
import linkedin from './icons/linkedin.svg';
import reddit from './icons/reddit.svg';
import twitter from './icons/twitter.svg';
import ycombinator from './icons/ycombinator.svg';

import styles from './ShareBlock.module.css';

const icons: {
	Icon: ComponentType<any>;
	color: string;
	getLink: (url: string, title: string) => string;
}[] = [
	{
		Icon: twitter,
		color: '#1DA1F2',
		getLink: (url, title) =>
			`https://twitter.com/share?url=${url}&text=${encodeURIComponent(title)}`,
	},
	{
		Icon: facebook,
		color: '#1877F2',
		getLink: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
	},
	{
		Icon: linkedin,
		color: '#0A66C2',
		getLink: (url) => `https://www.linkedin.com/cws/share?url=${url}`,
	},
	{
		Icon: reddit,
		color: '#FF4500',
		getLink: (url, title) =>
			`https://reddit.com/submit?url=${url}&title=${encodeURIComponent(title)}`,
	},
	{
		Icon: ycombinator,
		color: '#F0652F',
		getLink: (url, title) =>
			`https://news.ycombinator.com/submitlink?u=${url}&t=${encodeURIComponent(
				title,
			)}`,
	},
];

export const ShareBlock: FC<{ url: string; title: string }> = ({ url, title }) => {
	return (
		<div className={styles.ShareBlock}>
			{icons.map(({ Icon, getLink, color }, idx) => {
				const link = getLink(getFullUrl(url), title);

				return (
					<Link
						key={idx}
						className={styles.Icon}
						href={link}
						onClick={(evt) => {
							evt.preventDefault();
							open(link, '', 'width=640,height=270');
						}}
						rel="nofollow"
						external
					>
						<Icon style={{ fill: color }} />
					</Link>
				);
			})}
		</div>
	);
};
