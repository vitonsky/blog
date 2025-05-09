import favicons from 'favicons';

import fs from 'fs/promises';

// Script to generate favicon file from SVG
(async () => {
	const response = await favicons('./assets/logo.svg', {
		path: '/', // Path for overriding default icons path
		icons: {
			android: false,
			appleIcon: false,
			appleStartup: false,
			favicons: true,
			windows: false,
			yandex: false,
		},
	});

	const faviconObject = response.images.find((i) => i.name === 'favicon.ico');
	if (!faviconObject) throw new Error('Not found favicon');

	await fs.writeFile('./public/favicon.ico', faviconObject.contents);
})();
