import { SITE_ORIGIN } from '../../../consts';
import { isExternalUrl } from '../../../utils/links';

/**
 * @internal
 */
type EventPayload = {
	readonly n: string;
	readonly u: Location['href'];
	readonly d: Location['hostname'];
	readonly r: Document['referrer'] | null;
	readonly w: Window['innerWidth'];
	readonly h: 1 | 0;
	readonly p?: string;
};

/**
 * Options used when initializing the tracker.
 */
export type PlausibleInitOptions = {
	/**
	 * The domain to bind the event to.
	 * Defaults to `location.hostname`
	 */
	readonly domain: Location['hostname'];
	/**
	 * The API host where the events will be sent.
	 * Defaults to `'https://plausible.io'`
	 */
	readonly apiHost: string;
};

type EventProps = {
	url: string;
	referrer: string | null;
	deviceWidth: number;
	hashMode?: boolean;
	props?: Record<string, string>;
};

class Plausible {
	constructor(private readonly config: PlausibleInitOptions) { }

	public trackEvent(eventName: string, data?: Pick<EventProps, 'props'>) {
		return this.sendEvent(eventName, data);
	}

	public sendEvent(eventName: string, data?: Pick<EventProps, 'props'>) {
		return this.sendRequest(eventName, {
			hashMode: false,
			url: location.href,
			referrer: document.referrer || null,
			deviceWidth: window.innerWidth,
			...data,
		});
	}

	private sendRequest = async (eventName: string, data: EventProps) => {
		const { apiHost, domain } = this.config;

		const payload: EventPayload = {
			n: eventName,
			u: data.url,
			d: domain,
			r: data.referrer,
			w: data.deviceWidth,
			h: data.hashMode ? 1 : 0,
			p: data && data.props ? JSON.stringify(data.props) : undefined,
		};

		const response = await fetch(`${apiHost}/api/event`, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: JSON.stringify(payload),
			keepalive: true,
		});

		if (!response.ok) throw new Error(response.statusText);

		await response.text();
	};
}

const setupPlausible = () => {
	const plausible = new Plausible({
		domain: 'vitonsky.net',
		apiHost: 'https://pulse2.vitonsky.net',
	});

	// Source: https://github.com/plausible/plausible-tracker/blob/ab75723ad10660cbaee3718d1b0a670e2dfd717d/src/lib/tracker.ts#L253-L284
	const uid = Date.now();
	console.log('Capture view', uid);
	const trackPageview = () =>
		plausible.sendEvent('pageview', { props: { text: String(uid) } });
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

				// We should not try to capture click in dev mode,
				// since Plausible will never call a callback,
				// and link will never be clicked
				const isProduction = location.origin === SITE_ORIGIN;

				// We have to capture external clicks manually,
				// since plausible SDK ignores `target` property of anchor,
				// see issue: https://github.com/plausible/plausible-tracker/issues/12
				const shouldInterceptClick =
					isProduction &&
					node.href &&
					isExternalUrl(node.href) &&
					node.target != '_blank';

				if (shouldInterceptClick) {
					event.preventDefault();
				}

				const rawText = node.innerText.trim();
				const textLimit = 120;
				const text =
					rawText.length <= textLimit
						? rawText
						: rawText.slice(0, textLimit) + '...';

				plausible
					.trackEvent('linkClick', {
						props: {
							// Current location
							location: location.toString(),
							url: node.href,
							text,
						},
					})
					.finally(() => {
						if (!shouldInterceptClick) return;

						// Go to url after delay
						window.location.href = node.href;
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
