import { FC, ReactNode } from 'react';
import { Textinput } from 'react-elegant-ui/components/Textinput/Textinput.bundle/desktop';
import { cnTheme } from 'react-elegant-ui/theme';
import { theme } from 'react-elegant-ui/theme/presets/default';

import { siteInfo } from '../../lib/constants';
import { publicEmail, socialMedia } from '../../links';

import { Link } from '../Link/Link';
import { PageLoader } from '../PageLoader/PageLoader';
import { TopDownButton } from '../TopDownButton/TopDownButton';

import styles from './MainLayout.module.css';

export type MainLayoutProps = {
	children: ReactNode;
};

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className={cnTheme(theme, [styles.Main])}>
			<div className={styles.Head}>
				<div className={styles.HeadRow}>
					<Link href="/">Home</Link>
					<Link href="https://latexonline.cc/compile?git=https://github.com/vitonsky/resume&target=resume.tex&command=pdflatex">
						About me
					</Link>
					<Link href="/rss.xml" external>
						RSS
					</Link>
				</div>
				<div className={styles.HeadRow}>
					<Link href={socialMedia.twitter} target="_blank">
						Twitter
					</Link>
					<Link href={socialMedia.github} target="_blank">
						Github
					</Link>
					<Link href={socialMedia.stackoverflow} target="_blank">
						StackOverflow
					</Link>
					<Link href={socialMedia.linkedin} target="_blank">
						LinkedIn
					</Link>
					{/* <Link href="#" target="_blank">LinkedIn</Link> */}
					<Link href={`mailto:${publicEmail}`} target="_blank">
						Email
					</Link>
				</div>
				<div className={styles.HeadRow}>
					<form
						method="get"
						action="https://www.google.com/search"
						itemProp="potentialAction"
						itemScope
						itemType="http://schema.org/SearchAction"
						className={styles.SearchForm}
					>
						<meta
							itemProp="target"
							content="https://www.google.com/search?q={q}"
						/>
						<input
							name="sitesearch"
							value={new URL(siteInfo.url).hostname}
							type="hidden"
						/>
						<Textinput
							className={styles.SearchInput}
							placeholder="Search..."
							title="Search in Google"
							controlProps={{ name: 'q', autoComplete: 'off' }}
						/>
					</form>
				</div>
			</div>

			<div className={styles.Content}>{children}</div>

			<PageLoader />
			<TopDownButton />
		</div>
	);
};
