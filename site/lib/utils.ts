import { siteInfo } from './constants';

export const getDateFromTimestamp = (timestamp: number) => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	};
	return new Date(timestamp).toLocaleDateString('en-US', options);
};

export const getFullUrl = (relativePath: string) => siteInfo.url + relativePath;
