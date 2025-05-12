import {
	enableAutoOutboundTracking,
	enableAutoPageviews,
	Plausible,
} from 'plausible-client';

import { isExternalUrl } from '../../../utils/links';

const setupPlausible = () => {
	const plausible = new Plausible({
		domain: 'vitonsky.net',
		apiHost: 'https://pulse2.vitonsky.net',
		filter(event, eventName) {
			// Skip all events while development
			if (location.hostname === 'localhost') {
				console.warn('Analytics event is skipped, since run on localhost', event);
				return false;
			}

			// Skip all events for users who don't want to be tracked
			if (window.localStorage.plausible_ignore === 'true') return false;

			// Skip internal links
			if (eventName === 'Outbound Link: Click') {
				const url = event.props?.url;

				if (typeof url !== 'string' || !isExternalUrl(url)) return false;
			}

			// Pass all events otherwise
			return true;
		},
	});

	enableAutoPageviews(plausible);
	enableAutoOutboundTracking(plausible);

	document.addEventListener(
		'click',
		(event) => {
			// Iterate over all targets to find Anchor element and take its text
			// We do it instead of handle target, since click may appear on nested element
			for (const node of event.composedPath()) {
				if (!(node instanceof HTMLAnchorElement)) continue;

				const rawText = node.innerText.trim();
				const textLimit = 120;
				const text =
					rawText.length <= textLimit
						? rawText
						: rawText.slice(0, textLimit) + '...';

				plausible.trackEvent('linkClick', {
					props: {
						// Current location
						location: location.toString(),
						url: node.href,
						text,
					},
				});
			}
		},
		{ capture: true },
	);

	return plausible;
};

// We use singleton instance, to share it between all islands
let plausibleInstance: Plausible | null = null;
export const getPlausible = () => {
	// Init
	if (!plausibleInstance) {
		plausibleInstance = setupPlausible();
	}

	return plausibleInstance;
};
