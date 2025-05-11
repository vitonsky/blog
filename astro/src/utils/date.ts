import dateUtils from 'date-and-time';

export function parseCustomDate(input: string): Date | null {
	const formats = [
		'DD/MM/YYYY, HH:mm',
		'D MMM YYYY HH:mm',
		'YYYY/MM/D HH:mm',
		'YYYY/MM/D H:mm',
		'YYYY/MM/D',
	];

	for (const format of formats) {
		const date = dateUtils.parse(input, format);

		if (isNaN(date.getTime())) continue;

		return date;
	}

	return null;
}
