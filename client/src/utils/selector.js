export function getSequenceNumberArray(count) {
	const options = [];
	for (let i = 0; i <= count; i++)
		options.push({
			label: i.toString(),
			value: i
		});
	return options;
}