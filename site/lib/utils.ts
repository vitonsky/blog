import { siteInfo } from './constants';

export const getDateFromTimestamp = (timestamp: number) => {
	const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
	return new Date(timestamp).toLocaleDateString('en-US', options);
};

export const getFullUrl = (relativePath: string) => siteInfo.url + relativePath;
