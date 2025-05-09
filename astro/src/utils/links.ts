import { TRUSTED_HOSTS } from '../consts';

export const getBlogPostLink = (id: string) => `/blog/${id}/`;
export const getTagLink = (tag: string) => `/blog/tag/${tag}/`;

export const isExternalUrl = (url: string) => {
	if (
		url.startsWith('/') ||
		url.startsWith('.') ||
		TRUSTED_HOSTS.some((host) => url.startsWith(host))
	)
		return false;

	return true;
};
