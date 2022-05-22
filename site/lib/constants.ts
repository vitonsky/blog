export const siteInfo = {
	url: 'http://vitonsky.net',
	blogPath: '/blog',

	title: 'Blog about computers',
	author: 'Robert Vitonsky',

	description: 'Personal blog about computers and technologies',
} as const;

// TODO: add cover image
export const metaData: {
	name: string;
	content: string;
}[] = [
	{
		name: 'description',
		content: siteInfo.description,
	},
	{
		name: 'keywords',
		content: ['blog', 'computers', 'programming'].join(', '),
	},
];

export const publicDir = './public';
export const attachmentsPath = '/files';
