import { getTagLink } from "./utils/links";

type Link = {
	text: string;
	url: string;
	title?: string;
	target?: string;
}

export default {
	head: [
		{
			text: "Home",
			url: '/',
		},
		{
			text: "Projects",
			url: getTagLink('project'),
		},
		{
			text: "About",
			url: "/about",
		},
		{
			text: "Subscribe",
			url: "/about#subscribe",
		},
	],
	footer: [
		{
			title: 'General',
			links: [
				{
					text: "Home",
					url: '/',
				},
				{
					text: "My projects",
					url: getTagLink('project'),
				},
				{
					text: "About me",
					url: "/about#about-me",
				},
				{ text: "Contact with me", url: '/about#contact' },

			]
		},
		{
			title: 'Feeds',
			description: "Not all things goes to my blog. I share findings on my feeds, let's be in touch",
			links: [
				{ text: "Twitter", url: 'https://twitter.com/rvitonsky', target: '_blank' },
				{ text: "Mastodon", url: 'https://mastodon.social/@vitonsky', target: '_blank' },
				{
					text: "RSS",
					url: "/rss.xml",
				},
			]
		},
		{
			title: 'Social media',
			links: [
				{ text: "Github", url: 'https://github.com/vitonsky', target: '_blank' },
				{ text: "LinkedIn", url: 'https://www.linkedin.com/in/vitonsky', target: '_blank' },
				{ text: "StackOverflow", url: 'https://stackoverflow.com/users/18680275/vitonsky', target: '_blank' },
			]
		},
	],
} as {
	head: Link[];
	footer: Array<{
		title: string;
		description?: string;
		links: Link[];
	}>;
};