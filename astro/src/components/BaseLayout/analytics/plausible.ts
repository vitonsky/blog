import {
	enableAutoOutboundTracking,
	enableAutoPageviews,
	Plausible,
} from 'plausible-client';

const setupPlausible = () => {
	const plausible = new Plausible({
		domain: 'vitonsky.net',
		apiHost: 'https://pulse2.vitonsky.net',
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
