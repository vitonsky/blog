import { FC, ReactNode } from "react";

import Link from "next/link";

import { cnTheme } from "react-elegant-ui/theme";
import { theme } from "react-elegant-ui/theme/presets/default";
import { Textinput } from "react-elegant-ui/components/Textinput/Textinput.bundle/desktop";

import styles from "./MainLayout.module.css";

export type MainLayoutProps = {
	children: ReactNode;
};

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className={cnTheme(theme, [styles.Main])}>
			<div className={styles.Head}>
				<div className={styles.HeadRow}>
					<Link href="/" target="_blank">
						Home
					</Link>
					<Link href="/rss.xml" target="_blank">
						RSS
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
						<input name="sitesearch" value="domain.com" type="hidden" />
						<Textinput
							className={styles.SearchInput}
							placeholder="Search..."
							title="Search in Google"
							controlProps={{ name: "q", autoComplete: "off" }}
						/>
					</form>
				</div>
			</div>

			{children}
		</div>
	);
};
