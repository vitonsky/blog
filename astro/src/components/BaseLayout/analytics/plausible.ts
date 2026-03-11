import {
	enableAutoOutboundTracking,
	enableAutoPageviews,
	enableEngagementTracking,
	enableLinkClicksCapture,
	enableSessionScoring,
	filters,
	Plausible,
	skipByFlag,
	skipForHosts,
	userId,
} from 'plausible-client';

const setupPlausible = () => {
	const plausible = new Plausible({
		domain: 'vitonsky.net',
		apiHost: 'https://uxt.vitonsky.net',
		filter: filters(skipForHosts(['localhost']), skipByFlag('plausible_ignore')),
		transform: userId(),
	});

	enableAutoPageviews(plausible);
	enableSessionScoring(plausible);
	enableEngagementTracking(plausible);

	enableAutoOutboundTracking(plausible, { captureText: true });
	enableLinkClicksCapture(plausible, { captureText: true });

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
