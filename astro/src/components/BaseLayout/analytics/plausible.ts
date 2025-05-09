import Plausible from 'plausible-tracker';

import { isExternalUrl } from '../../../utils/links';

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
			for (const node of event.composedPath()) {
				if (!(node instanceof HTMLAnchorElement)) continue;

				// We have to capture external clicks manually,
				// since plausible SDK ignores `target` property of anchor,
				// see issue: https://github.com/plausible/plausible-tracker/issues/12
				const shouldInterceptClick =
					node.href && isExternalUrl(node.href) && node.target != '_blank';

				if (shouldInterceptClick) {
					event.preventDefault();
				}

				const rawText = node.innerText.trim();
				const textLimit = 120;
				const text =
					rawText.length <= textLimit
						? rawText
						: rawText.slice(0, textLimit) + '...';

				plausible.trackEvent('linkClick', {
					callback() {
						if (!shouldInterceptClick) return;

						// Go to url after delay
						window.location.href = node.href;
					},
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
let plausibleInstance: ReturnType<typeof Plausible> | null = null;
export const getPlausible = () => {
	// Init
	if (!plausibleInstance) {
		plausibleInstance = setupPlausible();
	}

	return plausibleInstance;
};
