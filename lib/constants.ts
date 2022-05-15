// TODO: set actual data
export const siteInfo = {
	url: "http://example.com",
	blogPath: "/blog",

	title: 'Blog name',
	author: 'Author Name',
} as const;

// TODO: set actual data
// TODO: add cover image
export const metaData: {
	name: string;
	content: string;
}[] = [
		{
			name: 'description',
			content: 'Some description about blog'
		},
		{
			name: 'keywords',
			content: ['blog', 'computers', 'programming'].join(', ')
		}
	];

export const contentDir = ".";
export const blogPostsDir = contentDir + "/posts";

export const publicDir = "./public";
export const attachmentsPath = "/files";