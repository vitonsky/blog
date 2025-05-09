import { Plausible } from './Plausible';

const setupPlausible = () => {
	const plausible = new Plausible({
		domain: 'vitonsky.net',
		apiHost: 'https://pulse2.vitonsky.net',
	});

	// Source: https://github.com/plausible/plausible-tracker/blob/ab75723ad10660cbaee3718d1b0a670e2dfd717d/src/lib/tracker.ts#L253-L284
	const trackPageview = () => plausible.sendEvent('pageview');
	const enableAutoPageviews = () => {
		const page = () => trackPageview();
		// Attach pushState and popState listeners
		const originalPushState = history.pushState;
		if (originalPushState) {
			history.pushState = function (data, title, url) {
				originalPushState.apply(this, [data, title, url]);
				page();
			};
			addEventListener('popstate', page);
		}

		// Trigger first page view
		trackPageview();

		return function cleanup() {
			if (originalPushState) {
				history.pushState = originalPushState;
				removeEventListener('popstate', page);
			}
		};
	};

	enableAutoPageviews();

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
