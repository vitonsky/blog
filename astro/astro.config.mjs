// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import shikiTheme from './shiki.json';

// https://astro.build/config
export default defineConfig({
	site: 'https://vitonsky.net',
	integrations: [mdx(), sitemap(), icon()],
	markdown: {
		shikiConfig: {
			theme: shikiTheme,
		},
	},
});
