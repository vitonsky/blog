// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import shikiTheme from './shiki.json';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap(), icon()],
	markdown: {
		shikiConfig: {
			theme: shikiTheme,
		},
	},
});