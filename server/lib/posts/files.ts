import { promise as glob } from "glob-promise";

import path from "path";

import { blogPostsDir, siteInfo } from "../../../lib/constants";

export const getPostUrlByFilename = (filePath: string) => {
	let pageUrl = path.basename(filePath);

	// remove extension
	const fileExtension = path.extname(pageUrl);
	if (fileExtension.length > 0) {
		pageUrl = pageUrl.slice(0, -fileExtension.length);
	}

	// TODO: split data in filename to URL segments
	return siteInfo.blogPath + '/' + pageUrl;
};

export const getFilenamesInDir = (
	directory: string | string[],
	ignore: string[] = []
) => {
	const directories = Array.isArray(directory) ? directory : [directory];
	return Promise.all(
		directories.map((directory) => glob(directory, { ignore }))
	).then((results) => {
		const postFilenames = new Set<string>();
		results.forEach((filenames) => {
			filenames.forEach((filename) => {
				postFilenames.add(filename);
			});
		});

		return Array.from(postFilenames);
	});
};

// TODO: exclude and warn filenames not by pattern `year-month-day-title`
// TODO: exclude and warn filenames with same urls from names
export const getPostFilenames = async () => {
	// Don't handle draft files
	const unlistedPaths = Boolean(process.env.SHOW_DRAFTS)
		? []
		: [blogPostsDir + "/_drafts/**"];

	return getFilenamesInDir(
		blogPostsDir + "/**/*.{md,mdx}",
		unlistedPaths
	);
}

export const getAttachmentFilenames = async () => {
	// Don't handle draft files
	const unlistedPaths = Boolean(process.env.SHOW_DRAFTS)
		? []
		: [blogPostsDir + "/_drafts/**"];

	return getFilenamesInDir(
		blogPostsDir + "/**/*.!(md|mdx)",
		unlistedPaths
	);
}

