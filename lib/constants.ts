// TODO: set actual data
export const siteInfo = {
	title: 'Blog name',
	author: 'Author Name',
};

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
			content: ['blog'].join(', ')
		}
	];

export const siteURL = "http://example.com";

export const blogUrlPath = "/blog";

export const contentDir = ".";
export const blogPostsDir = contentDir + "/posts";