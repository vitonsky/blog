import { FC, ReactNode, useCallback } from 'react';

import { Link } from '../Link/Link';

import styles from './Pagination.module.css';

export type Pagination = {
	currentPage: number;
	pagesNumber: number;
	prefix: string | ((page: number) => string);
	showNavigation?: boolean;
};

export const displayedPages = 3;

export const Pagination: FC<Pagination> = ({
	pagesNumber,
	currentPage,
	prefix,
	showNavigation = true,
}) => {
	const buildLink = useCallback(
		(page: number) => (typeof prefix === 'string' ? prefix + page : prefix(page)),
		[prefix],
	);

	const drawRange = (from: number, to: number) => {
		const pages: ReactNode[] = [];
		for (let pageNumber = from; pageNumber <= to; pageNumber++) {
			pages.push(
				<Link href={buildLink(pageNumber)} key={pageNumber}>
					{pageNumber}
				</Link>,
			);
		}

		return pages;
	};

	const pagesBeforeNum = currentPage > 1 ? currentPage - 1 : 0;
	let pagesBefore: ReactNode = null;
	if (pagesBeforeNum > 0) {
		const pagesNumber =
			pagesBeforeNum < displayedPages ? pagesBeforeNum : displayedPages;
		pagesBefore = drawRange(currentPage - pagesNumber, currentPage - 1);
	}

	const pagesAfterNum = currentPage < pagesNumber ? pagesNumber - currentPage : 0;
	let pagesAfter: ReactNode = null;
	if (pagesAfterNum > 0) {
		const pagesNumber =
			pagesAfterNum < displayedPages ? pagesAfterNum : displayedPages;
		pagesAfter = drawRange(currentPage + 1, currentPage + pagesNumber);
	}

	const prevPage = currentPage > 1 ? currentPage - 1 : null;
	const nextPage = currentPage < pagesNumber ? currentPage + 1 : null;

	return (
		<div className={styles.Pagination}>
			<span className={styles.NavigationItem}>
				{showNavigation && prevPage ? (
					<Link href={buildLink(prevPage)}>Previous page</Link>
				) : null}
			</span>
			<span className={styles.PagesList}>
				{pagesBefore}
				<span>{currentPage}</span>
				{pagesAfter}
			</span>
			<span className={styles.NavigationItem}>
				{showNavigation && nextPage ? (
					<Link href={buildLink(nextPage)}>Next page</Link>
				) : null}
			</span>
		</div>
	);
};
