import Plausible from 'plausible-tracker';

const setupPlausible = () => {
	const plausible = Plausible({
		domain: 'vitonsky.net',
		apiHost: 'https://pulse2.vitonsky.net',
	});

	plausible.enableAutoPageviews();

	document.addEventListener(
		'click',
		({ target }) => {
			if (!(target instanceof HTMLAnchorElement)) return;
			plausible.trackEvent('linkClick', {
				props: {
					// Current location
					location: location.toString(),
					url: target.href,
					text: target.innerText,
				},
			});
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
