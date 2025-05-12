import { SITE_ORIGIN, TRUSTED_HOSTS } from '../consts';

export const getBlogPostLink = (id: string) => `/blog/${id}/`;
export const getTagLink = (tag: string) => `/blog/tag/${tag}/`;

export const isExternalUrl = (url: string) => {
	if (url.startsWith('/') || url.startsWith('.') || url.startsWith(SITE_ORIGIN))
		return false;

	if (globalThis.location && url.startsWith(globalThis.location.origin)) return false;

	return true;
};

export const isNoFollowUrl = (url: string) => {
	const isTrustedHost = TRUSTED_HOSTS.some((host) => url.startsWith(host));
	if (isExternalUrl(url) && !isTrustedHost) return true;

	return false;
};
