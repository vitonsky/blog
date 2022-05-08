export const getDateFromTimestamp = (timestamp: number) => {
	const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
	return new Date(timestamp).toLocaleDateString('en-US', options);
}