import { promise as glob } from "glob-promise";
import colors from "colors";

import path from "path";

import { blogPostsDir, siteInfo } from "../../../lib/constants";

export const extractTimestampFromName = (filename: string) => {
	const matchResult = filename.match(/^\d{4}-\d{1,2}-\d{1,2}/);
	if (matchResult === null) return null;

	const date = new Date(matchResult[0]);
	const timestamp = date.getTime();
	return isNaN(timestamp) ? null : timestamp;
};

export const getPostUrlByFilename = (filePath: string) => {
	let pageUrl = path.basename(filePath);

	// remove extension
	const fileExtension = path.extname(pageUrl);
	if (fileExtension.length > 0) {
		pageUrl = pageUrl.slice(0, -fileExtension.length);
	}

	// TODO: split data in filename to URL segments
	// TODO: set consistent data format
	return siteInfo.blogPath + "/" + pageUrl;
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

// TODO: exclude and warn filenames with same urls from names
export const getPostFilenames = async () => {
	// Don't handle draft files
	const unlistedPaths = Boolean(process.env.SHOW_DRAFTS)
		? []
		: [blogPostsDir + "/_drafts/**"];

	return getFilenamesInDir(blogPostsDir + "/**/*.{md,mdx}", unlistedPaths).then(
		(filenames) =>
			filenames.filter((filename) => {
				const isValidFilename =
					extractTimestampFromName(path.basename(filename)) !== null;

				if (!isValidFilename) {
					console.warn(
						colors.yellow(
							`[skip post]: file "${filename}" is not contain date in name`
						)
					);
				}

				return isValidFilename;
			})
	);
};

export const getAttachmentFilenames = async () => {
	// Don't handle draft files
	const unlistedPaths = Boolean(process.env.SHOW_DRAFTS)
		? []
		: [blogPostsDir + "/_drafts/**"];

	return getFilenamesInDir(blogPostsDir + "/**/*.!(md|mdx)", unlistedPaths);
};
