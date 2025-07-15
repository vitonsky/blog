export const labelsMap = {
	project: {
		text: 'Project',
		icon: 'fa6-solid:bolt',
	},
	announce: {
		text: 'Announce',
		icon: 'fa6-solid:bullhorn',
	},
} satisfies Record<
	string,
	{
		text: string;
		icon?: string;
	}
>;

export type Labels = keyof typeof labelsMap;
