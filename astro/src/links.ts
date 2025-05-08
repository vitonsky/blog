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
			text: "About me",
			url: "https://latexonline.cc/compile?git=https://github.com/vitonsky/resume&target=resume.tex&command=pdflatex",
		},
		{
			text: "RSS",
			url: "/rss.xml",
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
					url: "https://latexonline.cc/compile?git=https://github.com/vitonsky/resume&target=resume.tex&command=pdflatex",
				},
				{ text: "Email", url: 'mailto:rob@vitonsky.net' },
			]
		},
		{
			title: 'My feeds',
			description: "Not all things goes to my blog. I share findings in my feeds, so let's be in touch",
			links: [
				{ text: "Twitter", url: 'https://twitter.com/rvitonsky', target: '_blank' },
				{ text: "Mastodon", url: 'https://mastodon.social/@vitonsky', target: '_blank' },
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