import Link from "next/link";
import { FC, ReactNode, useCallback } from "react";

export type Pagination = {
	currentPage: number;
	pagesNumber: number;
	prefix: string | ((page: number) => string);
	showNavigation?: boolean;
};

export const displayedPages = 10;

// TODO: improve layout
// TODO: use next links
export const Pagination: FC<Pagination> = ({
	pagesNumber,
	currentPage,
	prefix,
	showNavigation = true,
}) => {
	const buildLink = useCallback(
		(page: number) =>
			typeof prefix === "string" ? prefix + page : prefix(page),
		[prefix]
	);

	const drawRange = (from: number, to: number) => {
		const pages: ReactNode[] = [];
		for (let pageNumber = from; pageNumber <= to; pageNumber++) {
			pages.push(
				<a href={buildLink(pageNumber)} key={pageNumber}>
					{pageNumber}
				</a>
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

	const pagesAfterNum =
		currentPage < pagesNumber ? pagesNumber - currentPage : 0;
	let pagesAfter: ReactNode = null;
	if (pagesAfterNum > 0) {
		const pagesNumber =
			pagesAfterNum < displayedPages ? pagesAfterNum : displayedPages;
		pagesAfter = drawRange(currentPage + 1, currentPage + pagesNumber);
	}

	const prevPage = currentPage > 1 ? currentPage - 1 : null;
	const nextPage = currentPage < pagesNumber ? currentPage + 1 : null;

	return (
		<div>
			{showNavigation && prevPage ? (
				<Link href={buildLink(prevPage)}>Back</Link>
			) : null}
			{pagesBefore}
			<span>{currentPage}</span>
			{pagesAfter}
			{showNavigation && nextPage ? (
				<Link href={buildLink(nextPage)}>Next</Link>
			) : null}
		</div>
	);
};
