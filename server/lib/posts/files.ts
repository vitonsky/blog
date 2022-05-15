import { promise as glob } from "glob-promise";

import path from "path";

import { blogPostsDir, siteInfo } from "../../../lib/constants";

export const getPostUrlByFilename = (filePath: string) => {
	const fileRealpath = path.resolve(filePath);
	const postsDirRealpath = path.resolve(blogPostsDir);

	// remove prefix
	let pageUrl = fileRealpath.slice(postsDirRealpath.length);

	// remove extension
	const fileExtension = path.extname(pageUrl);
	if (fileExtension.length > 0) {
		pageUrl = pageUrl.slice(0, -fileExtension.length);
	}

	return siteInfo.blogPath + pageUrl;
};

export const getPostFilenameByUrl = (url: string) => {
	const relativePath = path.join(
		blogPostsDir,
		url.slice(siteInfo.blogPath.length) + ".md"
	);
	return path.resolve(relativePath);
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

export const getPostFilenames = async () => {
	// Don't handle draft files
	const unlistedPaths = Boolean(process.env.SHOW_DRAFTS)
		? []
		: [blogPostsDir + "/_drafts/**"];

	// Get all posts
	return getFilenamesInDir(
		blogPostsDir + "/**/*.{md,mdx}",
		unlistedPaths
	);
}

