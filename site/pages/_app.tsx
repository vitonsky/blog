import { useLayoutEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { siteInfo } from '../lib/constants';

import { MainLayout } from '../components/MainLayout/MainLayout';

import '../styles/app.css';

import 'highlight.js/styles/github.css';

function App({ Component, pageProps }: AppProps) {
	useLayoutEffect(() => {
		if (!('plausible' in window) || typeof window.plausible !== 'function') return;

		const trackEvent = window.plausible as (
			eventName: string,
			options: { props: Record<string, string> },
		) => void;

		document.body.addEventListener('click', ({ target }) => {
			if (!(target instanceof HTMLAnchorElement)) return;

			trackEvent('linkClick', {
				props: { url: target.href, text: target.innerText },
			});
		});
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>{siteInfo.title}</title>
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
				<script async src="https://pulse2.vitonsky.net/js/script.js"></script>
				<script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-9C2XWNMW56"
				></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
						// Global site tag (gtag.js) - Google Analytics
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-9C2XWNMW56');
					`
							.replace(/\t/g, '')
							.trim(),
					}}
				/>
			</Head>
			<Component {...pageProps} />
		</MainLayout>
	);
}

export default App;
