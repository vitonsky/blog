import Plausible from 'plausible-tracker';

const setupPlausible = () => {
	const plausible = Plausible({
		domain: 'vitonsky.net',
		apiHost: 'https://pulse2.vitonsky.net',
	});

	plausible.enableAutoPageviews();

	document.addEventListener(
		'click',
		(event) => {
			// Iterate over all targets to find Anchor element and take its text
			// We do it instead of handle target, since click may appear on nested element
			for (const target of event.composedPath()) {
				if (!(target instanceof HTMLAnchorElement)) continue;

				const rawText = target.innerText.trim();
				const textLimit = 120;
				const text =
					rawText.length <= textLimit
						? rawText
						: rawText.slice(0, textLimit) + '...';

				plausible.trackEvent('linkClick', {
					props: {
						// Current location
						location: location.toString(),
						url: target.href,
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
let plausibleInstance: ReturnType<typeof Plausible> | null = null;
export const getPlausible = () => {
	// Init
	if (!plausibleInstance) {
		plausibleInstance = setupPlausible();
	}

	return plausibleInstance;
};
